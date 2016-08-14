#!/usr/bin/env node

const bodyParser = require('body-parser')
const express = require('express')
const favicon = require('serve-favicon')
const fs = require('fs')
const hbs = require('express-handlebars')
const http = require('http')
const morgan = require('morgan')
const path = require('path')

const api = require('./api')
const Scraper = require('./utils/scraper')

const PORT = process.env.PORT || 3001
const ADDRESS = process.env.ADDRESS || 'localhost'

const app = express()
const server = http.createServer(app)

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('handlebars', hbs({ defaultLayout: 'single' }))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

app.get('/', (req, res) => {
  res.render('home', {})
})

app.use('/api', api)

app.get('/*', (req, res) => {
  res.redirect('/')
})

try {
  fs.accessSync(path.join(__dirname, 'data', 'stops.json'))
} catch (e) {
  Scraper.getStopList()
}

server.listen(PORT, ADDRESS, () => {
  console.log(`Listening @ http://${server.address().address}:${server.address().port}.`)
})

module.exports = exports = app
