'use strict'
import Validators from "../helpers/Validators"
import ErrorModel from "../models/ErrorModel"

class GruposService {
    constructor(dao) {
        this.dao = dao
    }

    /**
     * Consulta lista de grupos com base nos códigos informados ou todos os grupos caso nenhum código seja informado.
     * @param {array} ids Lista de códigos de grupos 
     * @returns Lista de grupos
     */
    async getGrupos(ids) {
        if (ids != null && ids !== undefined) {
            ids = ids.split(',')
            if (!Validators.isIntegerArray(ids) && !Validators.isInteger(ids)) {
                throw new ErrorModel(
                    `Lista de códigos de grupos '${ids}' é inválida`,
                    { code: 400 }
                )
            }
        }

        try {
            return await this.dao.findAll(ids ? ids : [])
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }
}

export default GruposService