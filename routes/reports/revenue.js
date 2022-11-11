'use strict'

import express from 'express'
import ReportsDao from '../../dao/ReportsDao'
import DatabaseHelper from '../../helpers/DatabaseHelper'
import { TokenHelper } from '../../helpers/SecurityHelper'
import ReportsService from '../../services/ReportsService'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const reportsService = new ReportsService(new ReportsDao(databaseHelper))

router.get('/by-day',
  TokenHelper.validate(),
  TokenHelper.check,
  reportsService.getRevenuePerDay.bind(reportsService)
)

router.get('/by-month',
  TokenHelper.validate(),
  TokenHelper.check,
  reportsService.getRevenuePerMonth.bind(reportsService)
)

router.get('/by-groups',
  TokenHelper.validate(),
  TokenHelper.check,
  reportsService.getRevenueByProductsGroups.bind(reportsService)
)

router.get('/best-selling-products',
  TokenHelper.validate(),
  TokenHelper.check,
  reportsService.getBestSellingProducts.bind(reportsService)
)

export default router
