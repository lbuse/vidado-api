'use strict'

import Validators from '../helpers/Validators'
import ProductsDao from '../dao/ProductsDao'
import createError from 'http-errors'

class ProductsService {
  /**
   * @param {ProductsDao} dao Gerenciador da fonte de dados
   */
  constructor(dao) {
    this.dao = dao
  }

  /**
   * Consulta de lista de produtos com base nos códigos informados ou todos caso nenhum tenha sido informado.
   * @param {array} ids Lista de códigos
   * @returns Lista de produtos
   */
  getByIds = async (req, res, next) => {
    const ids = req.query['ids']
    if (ids != null && ids !== undefined) {
      ids = ids.split(',')
      if (!Validators.isIntegerArray(ids) && !Validators.isInteger(ids)) {
        res.status(400).json({
          errors: {
            msg: `Lista de códigos de produtos '${ids}' é inválida`
          }
        })
        return
      }
    }

    const userData = req.decoded

    this.dao.findByIds(
      userData.domain,
      ids ? ids : []
    )
      .then(products => res.status(200).json(products))
      .catch(err => {
        console.log(err.text)
        res.status(500).json({
          errors: {
            msg: err.text
          }
        })
      })
  }

  /**
  * Consulta todos os produtos que satisfazem o termo buscado.
  * @param {string} termo Parte do nome de um produto
  * @returns Lista de produtos
  */
  getByName = async (req, res, next) => {
    const termo = req.query['s']
    if (!termo) {
      res.status(400).json({
        errors: {
          msg: `Termo '${termo}' é inválido`
        }
      })
      return
    }

    const userData = req.decoded

    this.dao.findByName(
      userData.domain,
      termo
    )
      .then(products => res.status(200).json(products))
      .catch(err => {
        console.log(err.text)
        res.status(500).json({
          errors: {
            msg: err.text
          }
        })
      })
  }
}

export default ProductsService
