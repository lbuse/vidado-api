'use strict'

import DatabaseHelper from '../helpers/DatabaseHelper'
import BestSellingProduct from '../models/BestSellingProduct'
import RevenuePerDay from '../models/RevenuePerDay'
import RevenuePerHourModel from '../models/RevenuePerHourModel'
import RevenuePerMonth from '../models/RevenuePerMonth'
import RevenuePerProductsGroupsModel from '../models/RevenuePerProductsGroupsModel'
import StoreScoreModel from '../models/StoreScoreModel'

class ReportsDao {
  /**
   * @param {DatabaseHelper} databaseHelper Conexão com o banco de dados
   */
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Consulta o faturamento de todas ou as lojas informadas dentro de
   * um período agrupado por dia.
   * @param {Date} startDate Inicio do período
   * @param {Date} endDate Fim do período
   * @param {string} domain Domínio da Matriz
   * @param {array<number>} storesIds Lista de lojas
   * @returns {Promise<RevenuePerDay>} Lista de faturamentos
   */
  async getFevenuePerDay(startDate, endDate, domain, storesIds) {
    let whereLojas = ''
    if (storesIds !== null && storesIds !== undefined && storesIds.length > 0) {
      whereLojas = ' AND v.id_loja IN ('
      for (let i = 0; i < storesIds.length; i++) {
        whereLojas += '?'
        if (i + 1 < storesIds.length) {
          whereLojas += ','
        }
      }
      whereLojas += ') '
    } else {
      // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
      storesIds = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        v.id_loja,
        l.nome AS loja,
        SUM(vi.quantidade) AS quantidade_total,
        SUM(vi.quantidade * vi.preco_unitario) AS preco_total,
        SUM(v.pessoas_atendidas) AS pessoas_atendidas_total,
        SUM(vi.quantidade * vi.preco_unitario) / SUM(v.pessoas_atendidas) AS ticket_medio,
        DATE(v.data) AS 'data'
      FROM Lojas AS l
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
        INNER JOIN vendas AS v
          ON v.id_loja = l.id
        INNER JOIN venda_itens AS vi
          ON vi.id_venda = v.id
      WHERE DATE(v.data) BETWEEN DATE(?) AND DATE(?)
        ${whereLojas}
      GROUP BY v.id_loja, DATE(v.data)
      ORDER BY DATE(v.data), v.id_loja`,
      [startDate, endDate, domain, ...storesIds]
    )
      .then(rows => {
        const revenue = []
        for (const row of rows) {
          revenue.push(new RevenuePerDay(
            row.id_loja,
            row.loja,
            row.quantidade_total,
            row.preco_total,
            row.pessoas_atendidas_total,
            row.ticket_medio,
            row.data
          ))
        }
        return revenue
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Consulta o faturamento de todas ou as lojas informadas dentro de
   * um período agrupado por mês.
   * @param {Date} startDate Inicio do período
   * @param {Date} endDate Fim do período
   * @param {string} domain Domínio da Matriz
   * @param {array<number>} storesIds Lista de lojas
   * @returns {Promise<RevenuePerMonth>} Lista de faturamentos
   */
  async getRevenuePerMonth(startDate, endDate, domain, storesIds) {
    let whereLojas = ''
    if (storesIds !== null && storesIds !== undefined && storesIds.length > 0) {
      whereLojas = ' AND v.id_loja IN ('
      for (let i = 0; i < storesIds.length; i++) {
        whereLojas += '?'
        if (i + 1 < storesIds.length) {
          whereLojas += ','
        }
      }
      whereLojas += ') '
    } else {
      // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
      storesIds = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        v.id_loja,
        l.nome AS loja,
        SUM(vi.quantidade) AS quantidade_total,
        SUM(vi.quantidade * vi.preco_unitario) AS preco_total,
        SUM(v.pessoas_atendidas) AS pessoas_atendidas_total,
        SUM(vi.quantidade * vi.preco_unitario) / SUM(v.pessoas_atendidas) AS ticket_medio,
        MAX(v.data) AS data_ultima_venda_mes,
        MONTH(v.data) AS mes,
        YEAR(v.data) AS ano
      FROM Lojas AS l
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
        INNER JOIN vendas AS v
          ON v.id_loja = l.id
        INNER JOIN venda_itens AS vi
           ON vi.id_venda = v.id
      WHERE DATE(v.data) BETWEEN ? AND ?
        AND UPPER(m.dominio) = UPPER(?)
        ${whereLojas}
      GROUP BY v.id_loja, YEAR(v.data), MONTH(v.data)
      ORDER BY YEAR(v.data), MONTH(v.data), v.id_loja`,
      [startDate, endDate, domain, ...storesIds]
    )
      .then(rows => {
        const revenue = []
        for (const row of rows) {
          revenue.push(new RevenuePerMonth(
            row.id_loja,
            row.loja,
            row.quantidade_total,
            row.preco_total,
            row.pessoas_atendidas_total,
            row.ticket_medio,
            row.data_ultima_venda_mes,
            row.mes,
            row.ano
          ))
        }
        return revenue
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Consulta o faturamento de todas ou as lojas informadas dentro de
   * um período agrupado por horário da venda.
   * @param {Date} startDate Inicio do período
   * @param {Date} endDate Fim do período
   * @param {string} domain Domínio da Matriz
   * @param {array<number>} storesIds Lista de lojas
   * @returns {Promise<RevenuePerHourModel>} Lista de faturamentos
   */
  async getRevenuePerHour(startDate, endDate, domain, storesIds) {
    let whereLojas = ''
    if (storesIds !== null && storesIds !== undefined && storesIds.length > 0) {
      whereLojas = ' AND v.id_loja IN ('
      for (let i = 0; i < storesIds.length; i++) {
        whereLojas += '?'
        if (i + 1 < storesIds.length) {
          whereLojas += ','
        }
      }
      whereLojas += ') '
    } else {
      // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
      storesIds = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
          v.id_loja,
          l.nome AS loja,
          SUM(vi.quantidade) AS quantidade_total,
          SUM(vi.quantidade * vi.preco_unitario) AS preco_total,
          SUM(v.pessoas_atendidas) AS pessoas_atendidas_total,
          v.data
        FROM Lojas AS l
          INNER JOIN Matriz AS m
            ON m.id = l.id_matriz
          INNER JOIN vendas AS v
              ON v.id_loja = l.id
          INNER JOIN venda_itens AS vi
              ON vi.id_venda = v.id
        WHERE DATE(v.data) BETWEEN ? AND ?
          AND UPPER(m.dominio) = UPPER(?)
          ${whereLojas}
        GROUP BY v.id_loja, v.data
        ORDER BY v.id_loja, v.data`,
      [startDate, endDate, domain, ...storesIds]
    )
      .then(rows => {
        const revenue = []
        for (const row of rows) {
          revenue.push(new RevenuePerHourModel(
            row.id_loja,
            row.loja,
            row.quantidade_total,
            row.preco_total,
            row.pessoas_atendidas_total
          ))
        }
        return revenue
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Consulta os grupos mais vendidos dentro do período informado.
   * @param {Date} startDate Inicio do período
   * @param {Date} endDate Fim do período
   * @param {string} domain Domínio da Matriz
   * @param {array<number>} storesIds Lista de lojas
   * @returns {Promise<RevenuePerProductsGroupsModel>} Lista faturamento por grupo
   */
  async getRevenuePerProductsGroups(startDate, endDate, domain, storesIds) {
    let whereLojas = ''
    if (storesIds !== null && storesIds !== undefined && storesIds.length > 0) {
      whereLojas = ' AND v.id_loja IN ('
      for (let i = 0; i < storesIds.length; i++) {
        whereLojas += '?'
        if (i + 1 < storesIds.length) {
          whereLojas += ','
        }
      }
      whereLojas += ') '
    } else {
      // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
      storesIds = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        v.id_loja,
        l.nome AS loja,
        p.id_grupo,
        g.nome AS grupo,
        SUM(vi.quantidade) AS quantidade_total,
        SUM(vi.quantidade * vi.preco_unitario) AS valor_total,
        SUM(vi.quantidade * vi.preco_unitario) / (SELECT SUM(vi_in.quantidade * vi_in.preco_unitario)
          FROM vendas AS v_in
          INNER JOIN venda_itens AS vi_in
            ON vi_in.id_venda = v_in.id
          WHERE v_in.id_loja = v.id_loja AND DATE(v_in.data) BETWEEN ? AND ?
        ) AS porcentagem
      FROM Lojas AS l
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
        INNER JOIN vendas AS v
          ON v.id_loja = l.id
        INNER JOIN venda_itens AS vi
          ON vi.id_venda = v.id
        INNER JOIN Produtos AS p
          ON p.id = vi.id_produto
        INNER JOIN Grupos AS g
          ON g.id = p.id_grupo
      WHERE DATE(v.data) BETWEEN ? AND ?
        AND UPPER(m.dominio) = UPPER(?)
        ${whereLojas}
      GROUP BY v.id_loja, p.id_grupo
      ORDER BY v.id_loja, p.id_grupo`,
      [startDate, endDate, startDate, endDate, domain, ...storesIds]
    )
      .then(rows => {
        const revenue = []
        for (const row of rows) {
          revenue.push(new RevenuePerProductsGroupsModel(
            row.id_loja,
            row.loja,
            row.id_grupo,
            row.grupo,
            row.quantidade_total,
            row.valor_total,
            row.porcentagem
          ))
        }
        return revenue
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Consulta os produtos mais vendidos dentro do período informado.
   * @param {Date} startDate Inicio do período
   * @param {Date} endDate Fim do período
   * @param {string} domain Domínio da Matriz
   * @param {array<number>} storesIds Lista de lojas
   * @returns {Promise<BestSellingProduct>} Lista de produtos por loja
   */
  async getBestSellingProducts(startDate, endDate, domain, storesIds) {
    let whereLojas = ''
    if (storesIds !== null && storesIds !== undefined && storesIds.length > 0) {
      whereLojas = ' AND v.id_loja IN ('
      for (let i = 0; i < storesIds.length; i++) {
        whereLojas += '?'
        if (i + 1 < storesIds.length) {
          whereLojas += ','
        }
      }
      whereLojas += ') '
    } else {
      // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
      storesIds = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
          id_loja,
          loja,
          produto,
          quantidade_total,
          total_vendido
      FROM (
          SELECT
            v.id_loja,
            l.nome AS loja,
            p.nome AS produto,
            SUM(vi.quantidade) AS quantidade_total,
            SUM(vi.quantidade * vi.preco_unitario) AS total_vendido
          FROM Lojas AS l
            INNER JOIN Matriz AS m
              ON m.id = l.id_matriz
            INNER JOIN vendas AS v
              ON v.id_loja = l.id
            INNER JOIN venda_itens AS vi
              ON vi.id_venda = v.id
            INNER JOIN Produtos AS p
              ON p.id = vi.id_produto
          WHERE DATE(v.data) BETWEEN ? AND ?
            AND UPPER(m.dominio) = UPPER(?)
            ${whereLojas}
          GROUP BY v.id_loja, vi.id_produto
          ORDER BY quantidade_total DESC
      ) AS table_aux
      GROUP BY id_loja
      ORDER BY id_loja`,
      [startDate, endDate, domain, ...storesIds]
    )
      .then(rows => {
        const bestSold = []
        for (const row of rows) {
          bestSold.push(new BestSellingProduct(
            row.id_loja,
            row.loja,
            row.produto,
            row.quantidade_total,
            row.total_vendido
          ))
        }
        return bestSold
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Consulta médias de avaliação de clientes.
   * @param {Date} startDate Inicio do período
   * @param {Date} endDate Fim do período
   * @param {string} domain Domínio da Matriz
   * @param {Array<number>} storesIds Lista de lojas
   * @returns {Promise<StoreScoreModel>} Lista de pontuação por loja
   */
  async getStoreScore(startDate, endDate, domain, storesIds) {
    let whereLojas = ''
    if (storesIds !== null && storesIds !== undefined && storesIds.length > 0) {
      whereLojas = ' AND v.id_loja IN ('
      for (let i = 0; i < storesIds.length; i++) {
        whereLojas += '?'
        if (i + 1 < storesIds.length) {
          whereLojas += ','
        }
      }
      whereLojas += ') '
    } else {
      // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
      storesIds = []
    }

    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        v.id_loja,
        l.nome,
        COUNT(v.id) AS qtd_vendas,
        AVG(v.satisfacao) AS media,
        STDDEV(v.satisfacao) AS desvio_padrao
      FROM vendas AS v
        INNER JOIN Lojas AS l
          ON v.id_loja = l.id
        INNER JOIN Matriz AS m
          ON m.id = l.id_matriz
      WHERE DATE(v.data) BETWEEN ? AND ?
        AND UPPER(m.dominio) = UPPER(?)
        ${whereLojas}
      GROUP BY id_loja
      ORDER BY id_loja`,
      [startDate, endDate, domain, ...storesIds]
    )
      .then(rows => {
        let scores = []
        for (const row of rows) {
          scores.push(new StoreScoreModel(
            row.id_loja,
            row.nome,
            row.qtd_vendas,
            row.media,
            row.desvio_padrao
          ))
        }
        return scores
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }
}

export default ReportsDao
