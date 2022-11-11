'use strict'

import express from 'express'
import ProductsDao from '../../dao/ProductsDao'
import { TokenHelper } from '../../helpers/SecurityHelper'
ProductsDao
import ProductsService from '../../services/ProductsService'
import DatabaseHelper from '../../helpers/DatabaseHelper'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const produtosService = new ProductsService(new ProductsDao(databaseHelper))

router.get('/',
  TokenHelper.validate(),
  TokenHelper.check,
  function (req, res, next) {
    if (req.query['s']) {
      produtosService.getByName(req, res, next)
    } else {
      produtosService.getByIds(req, res, next)
    }
  }
)

export default router
