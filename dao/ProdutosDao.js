'use strict'

class ProdutosDao {
    constructor(databaseHelper) {
        this.databaseHelper = databaseHelper
    }

    /**
     * Consulta de lista de produtos com base nos códigos informados ou todos caso nenhum tenha sido informado.
     * @param {array} ids Lista de códigos
     * @returns Lista de produtos
     */
    async findAll(ids) {
        let whereIds = ''
        if (ids !== null && ids !== undefined && ids.length > 0) {
            whereIds = ' WHERE id IN ('
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

        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
                `SELECT * FROM Produtos ${whereIds}`,
                ids
            )
        } finally {
            db.end()
        }

        return result
    }

    /**
     * Consulta todos os produtos que satisfazem o termo buscado
     * @param {string} name Parte do nome de um produto 
     * @returns Lista de produtos
     */
    async findByName(name) {
        let db = await this.databaseHelper.connect()
        let result = []
        try {
            result = await db.query(
                `SELECT * FROM Produtos WHERE nome LIKE '%${name}%'`
            )
        } finally {
            db.end()
        }

        return result
    }
}

export default ProdutosDao