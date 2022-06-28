'use strict'
import Validators from "../helpers/Validators"
import ErrorModel from "../models/ErrorModel"

class LojasService {
    constructor(dao) {
        this.dao = dao
    }

    /**
     * Consulta lista de lojas com base nos códigos informados ou todas as lojas caso nenhum código seja informado.
     * @param {array} ids Lista de códigos de lojas
     * @returns Lista de lojas
     */
    async getLojas(ids) {
        if (ids !== null && ids !== undefined) {
            ids = ids.split(',')
            if (!Validators.isIntegerArray(ids) && !Validators.isInteger(ids)) {
                throw new ErrorModel(
                    `Lista de códigos de lojas '${ids}' é inválida`,
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

export default LojasService