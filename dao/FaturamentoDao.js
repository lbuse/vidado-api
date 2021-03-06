'use strict'

class FaturamentoDao {
    constructor(databaseHelper) {
        this.databaseHelper = databaseHelper
    }

    /**
     * Consulta o faturamento de todas ou as lojas informadas dentro de 
     * um período agrupado por dia.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {array} lojas Lista de lojas
     * @returns Lista de faturamentos por loja
     */
    async getFaturamentoPorDia(dataInicial, dataFinal, lojas) {
        let whereLojas = ''
        if (lojas !== null && lojas !== undefined && lojas.length > 0) {
            whereLojas = ' AND v.id_loja IN ('
            for (let i = 0; i < lojas.length; i++) {
                whereLojas += '?'
                if (i + 1 < lojas.length) {
                    whereLojas += ','
                }
            }
            whereLojas += ') '
        } else {
            // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
            lojas = []
        }

        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
                `SELECT 
                    v.id_loja,
                    l.nome AS loja,
                    SUM(vi.quantidade) AS quantidade_total,
                    SUM(vi.quantidade * vi.preco_unitario) AS preco_total,
                    SUM(v.pessoas_atendidas) AS pessoas_atendidas_total,
	                SUM(vi.quantidade * vi.preco_unitario) / SUM(v.pessoas_atendidas) AS ticket_medio,
                    DATE(v.data) AS 'data'
                FROM Lojas AS l
                    INNER JOIN vendas AS v
                        ON v.id_loja = l.id
                    INNER JOIN venda_itens AS vi
                        ON vi.id_venda = v.id
                WHERE DATE(v.data) BETWEEN DATE(?) AND DATE(?)
                    ${whereLojas}
                GROUP BY v.id_loja, DATE(v.data)
                ORDER BY DATE(v.data), v.id_loja`,
                [dataInicial, dataFinal, ...lojas]
            )
        } finally {
            db.end()
        }

        return result
    }

    /**
     * Consulta o faturamento de todas ou as lojas informadas dentro de 
     * um período agrupado por mês.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {array} lojas Lista de lojas
     * @returns Lista de faturamentos
     */
    async getFaturamentoPorMes(dataInicial, dataFinal, lojas) {
        let whereLojas = ''
        if (lojas !== null && lojas !== undefined && lojas.length > 0) {
            whereLojas = ' AND v.id_loja IN ('
            for (let i = 0; i < lojas.length; i++) {
                whereLojas += '?'
                if (i + 1 < lojas.length) {
                    whereLojas += ','
                }
            }
            whereLojas += ') '
        } else {
            // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
            lojas = []
        }

        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
                `SELECT 
                    v.id_loja,
                    l.nome AS loja,
                    SUM(vi.quantidade) AS quantidade_total,
                    SUM(vi.quantidade * vi.preco_unitario) AS preco_total,
                    SUM(v.pessoas_atendidas) AS pessoas_atendidas_total,
                    SUM(vi.quantidade * vi.preco_unitario) / SUM(v.pessoas_atendidas) AS ticket_medio,
                    MONTH(v.data) AS mes,
                    YEAR(v.data) AS ano
                FROM Lojas AS l
                    INNER JOIN vendas AS v
                        ON v.id_loja = l.id
                    INNER JOIN venda_itens AS vi
                        ON vi.id_venda = v.id
                WHERE DATE(v.data) BETWEEN ? AND ? 
                    ${whereLojas}
                GROUP BY v.id_loja, YEAR(v.data), MONTH(v.data)
                ORDER BY YEAR(v.data), MONTH(v.data), v.id_loja`,
                [dataInicial, dataFinal, ...lojas]
            )
        } finally {
            db.end()
        }

        return result
    }

    /**
     * Consulta o faturamento de todas ou as lojas informadas dentro de 
     * um período agrupado por horário da venda.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {array} lojas Lista de lojas
     * @returns Lista de faturamentos por loja
     */
    async getVendasPorHorario(dataInicial, dataFinal, lojas) {
        let whereLojas = ''
        if (lojas !== null && lojas !== undefined && lojas.length > 0) {
            whereLojas = ' AND v.id_loja IN ('
            for (let i = 0; i < lojas.length; i++) {
                whereLojas += '?'
                if (i + 1 < lojas.length) {
                    whereLojas += ','
                }
            }
            whereLojas += ') '
        } else {
            // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
            lojas = []
        }

        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
                `SELECT 
                    v.id_loja,
                    l.nome AS loja,
                    SUM(vi.quantidade) AS quantidade_total,
                    SUM(vi.quantidade * vi.preco_unitario) AS preco_total,
                    SUM(v.pessoas_atendidas) AS pessoas_atendidas_total,
                    v.data
                FROM Lojas AS l
                    INNER JOIN vendas AS v
                        ON v.id_loja = l.id
                    INNER JOIN venda_itens AS vi
                        ON vi.id_venda = v.id
                WHERE DATE(v.data) BETWEEN ? AND ? 
                    ${whereLojas}
                GROUP BY v.id_loja, v.data 
                ORDER BY v.id_loja, v.data`,
                [dataInicial, dataFinal, ...lojas]
            )
        } finally {
            db.end()
        }

        return result
    }

    /**
     * Consulta os grupos mais vendidos dentro do período informado.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {array} lojas Lista de lojas
     * @returns Lista de grupos por loja
     */
    async getMaisVendidosPorGrupo(dataInicial, dataFinal, lojas) {
        let whereLojas = ''
        if (lojas !== null && lojas !== undefined && lojas.length > 0) {
            whereLojas = ' AND v.id_loja IN ('
            for (let i = 0; i < lojas.length; i++) {
                whereLojas += '?'
                if (i + 1 < lojas.length) {
                    whereLojas += ','
                }
            }
            whereLojas += ') '
        } else {
            // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
            lojas = []
        }

        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
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
                    INNER JOIN vendas AS v
                        ON v.id_loja = l.id
                    INNER JOIN venda_itens AS vi
                        ON vi.id_venda = v.id
                    INNER JOIN Produtos AS p
                        ON p.id = vi.id_produto
                    INNER JOIN Grupos AS g
                        ON g.id = p.id_grupo
                WHERE DATE(v.data) BETWEEN ? AND ? 
                    ${whereLojas}
                GROUP BY v.id_loja, p.id_grupo 
                ORDER BY v.id_loja, p.id_grupo`,
                [dataInicial, dataFinal, dataInicial, dataFinal, ...lojas]
            )
        } finally {
            db.end()
        }

        return result
    }

    /**
     * Consulta os produtos mais vendidos dentro do período informado.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {array} lojas Lista de lojas
     * @returns Lista de produtos por loja
     */
    async getProdutoMaisVendido(dataInicial, dataFinal, lojas) {
        let whereLojas = ''
        if (lojas !== null && lojas !== undefined && lojas.length > 0) {
            whereLojas = ' AND v.id_loja IN ('
            for (let i = 0; i < lojas.length; i++) {
                whereLojas += '?'
                if (i + 1 < lojas.length) {
                    whereLojas += ','
                }
            }
            whereLojas += ') '
        } else {
            // Apenas evita que o uso da propriedade lojas esteja indefinida ao usar no where
            lojas = []
        }

        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
                `SELECT
                    id_loja,
                    loja,
                    produto,
                    MAX(quantidade_total) AS quantidade_total
                FROM (
                    SELECT 
                        v.id_loja,
                        l.nome AS loja,
                        p.nome AS produto,
                        SUM(vi.quantidade) AS quantidade_total
                    FROM Lojas AS l
                        INNER JOIN vendas AS v
                            ON v.id_loja = l.id
                        INNER JOIN venda_itens AS vi
                            ON vi.id_venda = v.id
                        INNER JOIN Produtos AS p
                            ON p.id = vi.id_produto
                    WHERE DATE(v.data) BETWEEN ? AND ? 
                        ${whereLojas}
                    GROUP BY v.id_loja, vi.id_produto
                ) AS table_aux
                GROUP BY id_loja
                ORDER BY id_loja`,
                [dataInicial, dataFinal, ...lojas]
            )
        } finally {
            db.end()
        }

        return result
    }
}

export default FaturamentoDao