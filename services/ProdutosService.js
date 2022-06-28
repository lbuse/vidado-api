'use strict'
import Validators from "../helpers/Validators"
import ErrorModel from "../models/ErrorModel"

class ProdutosService {
    constructor(dao) {
        this.dao = dao
    }

    /**
     * Consulta de lista de produtos com base nos códigos informados ou todos caso nenhum tenha sido informado.
     * @param {array} ids Lista de códigos
     * @returns Lista de produtos
     */
    async getProdutos(ids) {
        if (ids != null && ids !== undefined) {
            ids = ids.split(',')
            if (!Validators.isIntegerArray(ids) && !Validators.isInteger(ids)) {
                throw new ErrorModel(
                    `Lista de códigos de produtos '${ids}' é inválida`,
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

     /**
     * Consulta todos os produtos que satisfazem o termo buscado.
     * @param {string} termo Parte do nome de um produto 
     * @returns Lista de produtos
     */
    async getProdutosPorNome(termo) {
        if(!termo) {
            throw new ErrorModel(
                `Termo '${termo}' é inválido`,
                { code: 400 }
            )
        }

        try {
            return await this.dao.findByName(termo)
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }
}

export default ProdutosService