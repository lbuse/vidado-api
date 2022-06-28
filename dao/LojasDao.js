'use strict'
const tableName = 'Lojas'

class LojasDao {
    constructor(databaseHelper) {
        this.databaseHelper = databaseHelper
    }

    /**
     * Consulta lista de lojas com base nos códigos informados ou todas as lojas caso nenhum código seja informado.
     * @param {array} ids Lista de códigos 
     * @returns  Lista de lojas
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
                `SELECT * FROM ${tableName} ${whereIds}`,
                ids
            )
        } finally {
            db.end()
        }

        return result
    }
}

export default LojasDao