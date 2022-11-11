'use strict'

import DatabaseHelper from '../helpers/DatabaseHelper'

class ProductsDao {
  /**
   * @param {DatabaseHelper} databaseHelper Conexão com o banco de dados
   */
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Consulta de lista de produtos com base nos códigos informados ou todos caso nenhum tenha sido informado.
   * @param {string} domain Domínio da Matriz
   * @param {array} ids Lista de códigos
   * @returns {Promise<Array<Product>>} Lista de produtos
   */
  async findByIds(domain, ids) {
    let whereIds = ''
    if (ids !== null && ids !== undefined && ids.length > 0) {
      whereIds = ' AND id IN ('
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
        p.id,
        p.id_grupo,
        p.nome,
        p.quantidade_sugerida,
        p.preco,
        p.preco_custo
      FROM Produtos AS p
        INNER JOIN produtos_loja AS pl
          ON pl.id_produto = p.id
        INNER JOIN Lojas AS l
          ON l.id = pl.id_loja
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
      WHERE AND UPPER(m.dominio) = UPPER(?)
        ${whereIds}`,
      ids
    )
      .then(rows => rows)
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Consulta todos os produtos que satisfazem o termo buscado.
   * @param {string} domain Domínio da Matriz
   * @param {string} name Parte do nome de um produto
   * @returns {Promise<Array<Product>} Lista de produtos
   */
  async findByName(domain, name) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        p.id,
        p.id_grupo,
        p.nome,
        p.quantidade_sugerida,
        p.preco,
        p.preco_custo
      FROM Produtos p
        INNER JOIN produtos_loja AS pl
          ON pl.id_produto = p.id
        INNER JOIN Lojas AS l
          ON l.id = pl.id_loja
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
      WHERE AND UPPER(m.dominio) = UPPER(?)
        AND nome LIKE '%?%'`,
      [domain, name]
    )
      .then(rows => rows)
      .finally(() => {
        if (conn) conn.release()
      })
  }
}

export default ProductsDao
