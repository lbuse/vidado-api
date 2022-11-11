'use strict'

import express from 'express'
import cors from 'cors'
import home from './home'
import products from './products'
import reports from './reports'
import signIn from './signIn'
import signUp from './signup'
import stores from './stores'
import user from './user'

const router = express.Router()

const setRequestEnv = (req, res, next) => {
  req.app.locals.tokenPrivateKey = process.env.API_TOKEN_PRIVATE_KEY
  next()
}

router.use('/signin', setRequestEnv, signIn)
router.use('/signup', setRequestEnv, signUp)
router.use('/stores', setRequestEnv, stores)
router.use('/products', setRequestEnv, products)
router.use('/reports', setRequestEnv, reports)
router.use('/user', setRequestEnv, user)
router.use('/', cors(), home)

export default router
