'use strict'
const bodyParser = require('body-parser')
const express = require('express')
const favicon = require('serve-favicon')
const hbs = require('express-handlebars')
const helmet = require('helmet')
const http = require('http')
const morgan = require('morgan')
const override = require('method-override')
const path = require('path')

const api = require('./api')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || '0.0.0.0'
const VERSION = 'v1'

const app = express()
const server = http.createServer(app)

app.engine('handlebars', hbs({defaultLayout: 'default'}))
app.set('view engine', 'handlebars')

app.use(helmet())

app.use(bodyParser.urlencoded({'extended': 'true'}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(favicon(path.join(__dirname, '..', 'public/favicon.ico')))

app.use(override('X-HTTP-Method-Override'))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: logger.stream }))
}

app.use(`/api/${VERSION}`, api)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/*', (req, res) => {
  res.redirect('/')
})

server.listen(PORT, HOST, (err) => {
  if (err) {
    logger.error(err)
    return
  }

  let { address, port } = server.address()
  logger.info(`Listening @ ${address}:${port}.`)
})
