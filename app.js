'use strict'
import compression from 'compression'
// import cors from 'cors'
import express from 'express'
// import helmet from 'helmet'
import methodOverride from 'method-override'
import logger from 'morgan'
import path from 'path'
import routes from './routes'

const app = express()

// reset subdomain defaul offset
app.set('subdomain offset', 1)

// trust proxy server
app.set('trust proxy', true)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hjs')

// server config
app.use(methodOverride('X-HTTP-Method'))
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(methodOverride('X-Method-Override'))
app.use(methodOverride('_method'))
// app.use(cors())

app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(express.static('public'))
// app.use(helmet())
// app.use(helmet.hidePoweredBy({ setTo: 'PHP 8.1.12' }))
// TODO Descomentar quando swagger corrigir problema de SPC.
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"]
//   }
// }))
// app.use(helmet.permittedCrossDomainPolicies())
// app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

// router
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({
    message: `Rota '${req.originalUrl}' não existe.`
  })
  next()
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
