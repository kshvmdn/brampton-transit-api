const express = require('express')
const http = require('http')
const morgan = require('morgan')

const api = require('./api')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3001
const ADDRESS = process.env.ADDRESS || 'localhost'

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/api', api)

app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  let message = err.message || 'Unexpected Error'
  let status = err.status || 500

  let response = {
    data: null,
    meta: { status, message }
  }

  res.status(status).json(response)
})

server.listen(PORT, ADDRESS, () => {
  let { address, port } = server.address()
  console.log(`Listening @ http://${address}:${port}.`)
})

module.exports = exports = app
