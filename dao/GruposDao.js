'use strict'
const tableName = 'Grupos'

class GruposDao {
    constructor(databaseHelper) {
        this.databaseHelper = databaseHelper
    }

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

export default GruposDao