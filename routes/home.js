'use strict'

import express from 'express'
import fs from 'fs'
import yaml from 'js-yaml'
import swaggerUi from 'swagger-ui-express'

const router = express.Router()
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'))
const swaggerOptions = {
  dom_id: '#swaggerContainer',
  customSiteTitle: 'Vidado API',
  // customfavIcon: 'img/favicon.ico',
  // customCssUrl: 'css/theme-flattop.css',
  customCss: '.swagger-ui .topbar { display: none }'
}

router.use('/', swaggerUi.serve)
router.get('/', function (req, res, next) {
  swaggerDocument.servers = [
    {
      url: `${process.env.SWAGGER_SERVER_ADDRESS}:${process.env.PORT}`,
      description: 'Servidor de produção'
    }
  ]
  req.swaggerDoc = swaggerDocument
  next()
},
swaggerUi.setup(swaggerDocument, swaggerOptions))

export default router
