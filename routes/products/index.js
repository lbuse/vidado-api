'use strict'

import express from 'express'
import groups from './groups'
import products from './products'

const router = express.Router()

router.use('/groups', groups)
router.use('/', products)

export default router
