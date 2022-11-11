'use strict'

import express from 'express'
import UserDao from '../dao/UserDao'
import DatabaseHelper from '../helpers/DatabaseHelper'
import { TokenHelper } from '../helpers/SecurityHelper'
import UserService from '../services/UserService'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const userDao = new UserDao(databaseHelper)
const userService = new UserService(userDao)

router.patch('/change-password',
  TokenHelper.validate(),
  TokenHelper.check,
  UserService.validate('changePassword'),
  userService.changePassword.bind(userService)
)

export default router
