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
  UserService.validate('signUp'),
  userService.signUp.bind(userService)
)

export default router
