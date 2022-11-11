'use strict'

import Validators from '../helpers/Validators'
import ReportsDao from '../dao/ReportsDao'

class ReportsService {
  /**
   * @param {ReportsDao} dao Gerenciador da fonte de dados
   */
  constructor(dao) {
    this.dao = dao
  }

  /**
   * Consulta o faturamento de todas ou as lojas informadas dentro de
   * um período agrupado por dia.
   */
  getRevenuePerDay = async (req, res, next) => {
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const storesIds = req.query['storesIds']
    const errorMessage = ReportsService._isCommonParamsValid(
      startDate,
      endDate,
      storesIds
    )
    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      })
    }

    const userData = req.decoded

    this.dao.getFevenuePerDay(
      new Date(startDate),
      new Date(endDate),
      userData.domain,
      storesIds ? storesIds.split(',') : []
    )
      .then(revenues => res.status(200).json(revenues))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Consulta o faturamento de todas ou as lojas informadas dentro de
   * um período agrupado por mês.
   */
  getRevenuePerMonth = async (req, res, next) => {
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const storesIds = req.query['storesIds']
    const errorMessage = ReportsService._isCommonParamsValid(
      startDate,
      endDate,
      storesIds
    )
    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      })
    }

    const userData = req.decoded

    this.dao.getRevenuePerMonth(
      new Date(startDate),
      new Date(endDate),
      userData.domain,
      storesIds ? storesIds.split(',') : []
    )
      .then(revenues => res.status(200).json(revenues))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Consulta o faturamento de todas ou as lojas informadas dentro de
   * um período agrupado por horário da venda.
   */
  getRevenuePerHour = async (req, res, next) => {
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const storesIds = req.query['storesIds']
    const errorMessage = ReportsService._isCommonParamsValid(
      startDate,
      endDate,
      storesIds
    )
    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      })
    }

    const userData = req.decoded

    this.dao.getRevenuePerHour(
      new Date(startDate),
      new Date(endDate),
      userData.domain,
      storesIds ? storesIds.split(',') : []
    )
      .then(revenues => res.status(200).json(revenues))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Consulta os grupos mais vendidos dentro do período informado.
   */
  getRevenueByProductsGroups = async (req, res, next) => {
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const storesIds = req.query['storesIds']
    const errorMessage = ReportsService._isCommonParamsValid(
      startDate,
      endDate,
      storesIds
    )
    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      })
    }

    const userData = req.decoded

    this.dao.getRevenuePerProductsGroups(
      new Date(startDate),
      new Date(endDate),
      userData.domain,
      storesIds ? storesIds.split(',') : []
    )
      .then(revenues => res.status(200).json(revenues))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Consulta os produtos mais vendidos dentro do período informado.
   */
  getBestSellingProducts = async (req, res, next) => {
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const storesIds = req.query['storesIds']
    const errorMessage = ReportsService._isCommonParamsValid(
      startDate,
      endDate,
      storesIds
    )
    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      })
    }

    const userData = req.decoded

    this.dao.getBestSellingProducts(
      new Date(startDate),
      new Date(endDate),
      userData.domain,
      storesIds ? storesIds.split(',') : []
    )
      .then(revenues => res.status(200).json(revenues))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Consulta medias de avaliação de clientes.
   */
  getStoreScore = async (req, res, next) => {
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const storesIds = req.query['storesIds']
    const errorMessage = ReportsService._isCommonParamsValid(
      startDate,
      endDate,
      storesIds
    )
    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      })
    }

    const userData = req.decoded

    this.dao.getStoreScore(
      new Date(startDate),
      new Date(endDate),
      userData.domain,
      storesIds ? storesIds.split(',') : []
    )
      .then(scores => res.status(200).json(scores))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Validadores comumns das requisições dessa classe
   * @param {Date} startDate Data inicial
   * @param {Date} endDate Data final
   * @param {array} storesIds Lista de IDs das lojas
   * @returns {string|undefined} Retorna uma mensagem de erro ou undefined
   */
  static _isCommonParamsValid(startDate, endDate, storesIds) {
    if (!Validators.isValidDate(startDate)) {
      return `startDate com o valor: '${startDate}' é inválida`
    } else if (!Validators.isValidDate(endDate)) {
      return `endDate com o valor '${endDate}' é inválida`
    } else if (!Validators.isValidDateRange(startDate, endDate)) {
      return `startDate '${startDate}' deve ser menor ou igual a endDate '${endDate}'`
    } else if (storesIds !== null && storesIds !== undefined) {
      storesIds = storesIds.split(',')
      if (!Validators.isIntegerArray(storesIds) && !Validators.isInteger(storesIds)) {
        return `ids com o valor '${storesIds}' é inválida`
      }
    }
  }
}

export default ReportsService
