'use strict'

import express from 'express'
import UserService from '../services/UserService'
import DatabaseHelper from '../helpers/DatabaseHelper'
import UserDao from '../dao/UserDao'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const userService = new UserService(new UserDao(databaseHelper))

router.post(
  '/',
  UserService.validate('signIn'),
  userService.signIn.bind(userService)
)

router.post(
  '/forgot',
  UserService.validate('createPasswordRecoveryCode'),
  userService.createPasswordRecoveryCode.bind(userService)
)

router.post(
  '/forgot/check-code',
  UserService.validate('checkRecoveryCode'),
  userService.checkRecoveryCode.bind(userService)
)

router.patch(
  '/forgot/reset-password',
  UserService.validate('resetPassword'),
  userService.resetPassword.bind(userService)
)

export default router
