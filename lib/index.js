'use strict'
const bodyParser = require('body-parser')
const express = require('express')
const favicon = require('serve-favicon')
const helmet = require('helmet')
const http = require('http')
const morgan = require('morgan')
const override = require('method-override')
const path = require('path')

const routes = require('./routes')
const { HOST, PORT } = require('./constants')
const logger = require('./utils/logger')

const app = express()
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': 'true'}))
app.use(favicon(path.join(__dirname, '..', 'public/favicon.ico')))
app.use(helmet())
app.use(morgan('combined', { stream: logger.stream }))
app.use(override('X-HTTP-Method-Override'))

app.use('/', routes);

server.listen(PORT, HOST, err => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }

  let { address, port } = server.address()
  logger.info(`Listening @ ${address}:${port}.`)
})

module.exports = app
