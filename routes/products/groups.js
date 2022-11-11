'use strict'

import express from 'express'
import GroupsDao from '../../dao/GroupsDao'
import DatabaseHelper from '../../helpers/DatabaseHelper'
import { TokenHelper } from '../../helpers/SecurityHelper'
import GroupsService from '../../services/GroupsService'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const groupsService = new GroupsService(new GroupsDao(databaseHelper))

router.get('/',
  TokenHelper.validate(),
  TokenHelper.check,
  groupsService.getByIds.bind(groupsService)
)

export default router
