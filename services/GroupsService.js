'use strict'

import createError from 'http-errors'
import GroupsDao from '../dao/GroupsDao'
import Validators from '../helpers/Validators'

class GroupsService {
  /**
   * @param {GroupsDao} dao Gerenciador da fonte de dados
   */
  constructor(dao) {
    this.dao = dao
  }

  /**
   * Consulta lista de grupos com base nos códigos informados ou todos os grupos caso nenhum código seja informado.
   * @param {string} ids Lista de códigos de grupos
   */
  getByIds = async (req, res, next) => {
    let ids = req.query['ids']
    if (ids != null && ids !== undefined) {
      ids = ids.split(',')
      if (!Validators.isIntegerArray(ids) && !Validators.isInteger(ids)) {
        res.status(400).json({
          errors: {
            msg: `Lista de códigos de grupos '${ids}' é inválida`
          }
        })
        return
      }
    }

    const userData = req.decoded

    this.dao.findAll(
      userData.domain,
      ids ? ids : []
    )
      .then(groups => res.status(200).json(groups))
      .catch(err => {
        console.log(err)
        res.status(500).json({
          errors: {
            msg: err.text
          }
        })
      })
  }
}

export default GroupsService
