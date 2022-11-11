'use strict'

import createError from 'http-errors'
import StoresDao from '../dao/StoresDao'
import Validators from '../helpers/Validators'

class StoresService {
  /**
   * @param {StoresDao} dao Gerenciador da fonte de dados
   */
  constructor(dao) {
    this.dao = dao
  }

  /**
   * Consulta lista de lojas com base nos códigos informados ou todas as lojas caso nenhum código seja informado.
   * @param {string} ids Lista de códigos de lojas
   */
  getByIds = async (req, res, next) => {
    let ids = req.query.ids;
    if (ids !== null && ids !== undefined) {
      ids = ids.split(',')
      if (!Validators.isIntegerArray(ids) && !Validators.isInteger(ids)) {
        return res.status(400).json({
          message: `Lista de códigos de lojas '${ids}' é inválida`
        })
      }
    }

    const userData = req.decoded

    this.dao.findByIds(
      userData.domain,
      ids ? ids : []
    )
      .then(groups => res.status(200).json(groups))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }
}

export default StoresService
