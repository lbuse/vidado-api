'use strict'

import express from 'express'
import ReportsDao from '../../dao/ReportsDao'
import DatabaseHelper from '../../helpers/DatabaseHelper'
import { TokenHelper } from '../../helpers/SecurityHelper'
import ReportsService from '../../services/ReportsService'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const reportsService = new ReportsService(new ReportsDao(databaseHelper))

router.get('/peak',
  TokenHelper.validate(),
  TokenHelper.check,
  reportsService.getRevenuePerHour.bind(reportsService)
)

router.get('/score',
  TokenHelper.validate(),
  TokenHelper.check,
  reportsService.getStoreScore.bind(reportsService)
)

export default router
