'use strict'

import DatabaseHelper from '../helpers/DatabaseHelper'
import GroupModel from '../models/GroupModel'

const tableName = 'Grupos'

class GroupsDao {
  /**
   * @param {DatabaseHelper} databaseHelper Gerenciador de conexão com banco de dados
   */
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Consulta lista de grupos com base nos códigos informados ou todos os grupos caso nenhum código seja informado.
   * @param {string} domain Domínio da Matriz
   * @param {array} ids Lista de códigos
   * @returns {Promise<Array<Group>>} Lista de grupos
   */
  async findAll(domain, ids) {
    let whereIds = ''
    if (ids !== null && ids !== undefined && ids.length > 0) {
      whereIds = ' AND g.id IN ('
      for (let i = 0; i < ids.length; i++) {
        whereIds += '?'
        if (i + 1 < ids.length) {
          whereIds += ','
        }
      }
      whereIds += ') '
    } else {
      // Apenas evita que o uso da propriedade ids esteja indefinida ao usar no where
      ids = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        g.id,
        g.nome
      FROM ${tableName} AS g
        INNER JOIN Produtos AS p
          ON g.id = p.id_grupo
        INNER JOIN produtos_loja AS pl
          ON pl.id_produto = p.id
        INNER JOIN Lojas AS l
          ON l.id = pl.id_loja
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
        WHERE UPPER(m.dominio) = UPPER(?)
          ${whereIds}
        GROUP BY g.id, g.nome`,
      [domain, ...ids]
    )
      .then(rows => {
        const groups = []
        for (const row of rows) {
          groups.push(new GroupModel(
            row.id,
            row.nome
          ))
        }
        return groups
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }
}

export default GroupsDao
