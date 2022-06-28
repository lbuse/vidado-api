'use strict'
import Validators from "../helpers/Validators"
import ErrorModel from "../models/ErrorModel"

class FaturamentoService {
    constructor(dao) {
        this.dao = dao
    }

    /**
     * Consulta o faturamento de todas ou as lojas informadas dentro de 
     * um período agrupado por dia.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {number} lojas Lista de lojas
     * @returns Lista de faturamentos por loja
     */
    async getFaturamentoPorDia(dataInicial, dataFinal, lojas = '') {
        FaturamentoService._isCommonParamsValid(dataInicial, dataFinal, lojas)

        try {
            return await this.dao.getFaturamentoPorDia(
                new Date(dataInicial),
                new Date(dataFinal),
                lojas ? lojas.split(',') : []
            )
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }

    /**
     * Consulta o faturamento de todas ou as lojas informadas dentro de 
     * um período agrupado por mês.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {number} lojas Lista de lojas
     * @returns Lista de faturamentos por loja
     */
    async getFaturamentoPorMes(dataInicial, dataFinal, lojas = '') {
        FaturamentoService._isCommonParamsValid(dataInicial, dataFinal, lojas)

        try {
            return await this.dao.getFaturamentoPorMes(
                new Date(dataInicial),
                new Date(dataFinal),
                lojas ? lojas.split(',') : []
            )
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }

    /**
     * Consulta o faturamento de todas ou as lojas informadas dentro de 
     * um período agrupado por horário da venda.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {number} lojas Lista de lojas
     * @returns Lista de faturamentos por loja
     */
    async getVendasPorHorario(dataInicial, dataFinal, lojas) {
        FaturamentoService._isCommonParamsValid(dataInicial, dataFinal, lojas)

        try {
            return await this.dao.getVendasPorHorario(
                new Date(dataInicial),
                new Date(dataFinal),
                lojas ? lojas.split(',') : []
            )
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }

    /**
     * Consulta os grupos mais vendidos dentro do período informado.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {array} lojas Lista de lojas
     * @returns Lista de grupos por loja
     */
    async getMaisVendidosPorGrupo(dataInicial, dataFinal, lojas) {
        FaturamentoService._isCommonParamsValid(dataInicial, dataFinal, lojas)

        try {
            return await this.dao.getMaisVendidosPorGrupo(
                new Date(dataInicial),
                new Date(dataFinal),
                lojas ? lojas.split(',') : []
            )
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }

    /**
     * Consulta os produtos mais vendidos dentro do período informado.
     * @param {Date} dataInicial Inicio do período
     * @param {Date} dataFinal Fim do período
     * @param {number} lojas Lista de lojas
     * @returns Lista de produtos por loja
     */
    async getProdutoMaisVendido(dataInicial, dataFinal, lojas = '') {
        FaturamentoService._isCommonParamsValid(dataInicial, dataFinal, lojas)

        try {
            return await this.dao.getProdutoMaisVendido(
                new Date(dataInicial),
                new Date(dataFinal),
                lojas ? lojas.split(',') : []
            )
        } catch (e) {
            throw new ErrorModel(e.text, { code: 500, stackTrace: e.stack })
        }
    }

    /**
     * 
     * @param {Date} dataInicial 
     * @param {Date} dataFinal 
     * @param {array} lojas 
     */
    static _isCommonParamsValid(dataInicial, dataFinal, lojas) {
        if (!Validators.isValidDate(dataInicial)) {
            throw new ErrorModel(
                `Data inicial '${dataInicial}' é inválida`,
                { code: 400 }
            )
        } else if (!Validators.isValidDate(dataFinal)) {
            throw new ErrorModel(
                `Data final '${dataFinal}' é inválida`,
                { code: 400 }
            )
        } else if (!Validators.isValidDateRange(dataInicial, dataFinal)) {
            throw new ErrorModel(
                `Data inicial '${dataInicial}' deve ser menor ou igual a data final '${dataFinal}'`,
                { code: 400 }
            )
        } else if (lojas !== null && lojas !== undefined) {
            lojas = lojas.split(',')
            if (!Validators.isIntegerArray(lojas) && !Validators.isInteger(lojas)) {
                throw new ErrorModel(
                    `Lista de lojas '${lojas}' é inválida`,
                    { code: 400 }
                )
            }
        }
    }
}

export default FaturamentoService