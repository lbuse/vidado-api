'use strict'

import express from 'express'
import store from './store'
import revenue from './revenue'

const router = express.Router()

router.use('/revenue', revenue)
router.use('/store', store)


export default router
