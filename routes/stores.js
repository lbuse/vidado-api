'use strict'

import express from 'express'
import StoresDao from '../dao/StoresDao'
import { TokenHelper } from '../helpers/SecurityHelper'
import StoresService from '../services/StoresService'
import DatabaseHelper from '../helpers/DatabaseHelper'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const storeService = new StoresService(new StoresDao(databaseHelper))

router.get('/',
  TokenHelper.validate(),
  TokenHelper.check,
  storeService.getByIds.bind(storeService)
)

export default router
