'use strict'

import StoreModel from "../models/StoreModel"

const tableName = 'Lojas'

class StoresDao {
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Consulta lista de lojas com base nos códigos informados ou todas as lojas caso nenhum código seja informado.
   * @param {string} domain Domínio da Matriz
   * @param {array} ids Lista de códigos
   * @returns {Promise<Array<Store>>} Lista de lojas
   */
  async findByIds(domain, ids) {
    let whereIds = ''
    if (ids !== null && ids !== undefined && ids.length > 0) {
      whereIds = ' AND l.id IN ('
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
        l.id,
        l.id_matriz,
        l.nome,
        l.status,
        l.pais,
        l.uf,
        l.cidade,
        l.endereco
        FROM ${tableName} AS l
          INNER JOIN Matriz AS m
            ON m.id = l.id_matriz
        WHERE UPPER(m.dominio) = UPPER(?)
          ${whereIds}`,
      [domain, ...ids]
    )
      .then(rows => {
        const stores = []
        for (const row of rows) {
          stores.push(new StoreModel(
            row.id,
            row.id_matriz,
            row.nome,
            row.status == 1 ? 'ativa' : 'desativada',
            row.pais,
            row.uf,
            row.cidade,
            row.endereco
          ))
        }
        return stores
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }
}

export default StoresDao
