'use strict'
const express = require('express')

const client = require('./../config/redis')
const ResponseHandler = require('./../middleware/handle-api-response')
const ErrorHandler = require('./../middleware/handle-api-error')
const StopScraper = require('./../scrapers/stop-scraper')
const CacheWorker = require('./../utils/cache-worker')

const router = express.Router()
const cw = new CacheWorker(client)

router.use((req, res, next) => {
  res.api_response = {}
  next()
})

router.get('/routes', (req, res, next) => {
  res.send('/routes')
  // @TODO
})

router.get('/search/stops/:query', (req, res, next) => {
  res.send(`/search/stops/${req.params.query}`)
  // @TODO
})

router.get('/stops', (req, res, next) => {
  res.send('/stops')
  // @TODO
})

router.get('/stops/:route', (req, res, next) => {
  res.send(`/stops/${req.params.route}`)
  // @TODO
})

router.get('/stop/:stop', (req, res, next) => {
  let stop = req.params.stop
  let cacheKey = `stop:${stop}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      StopScraper.scrape(stop, (error, response) => {
        if (error) {
          return next(error)
        }

        res.api_response.data = response

        if (cw) {
          cw.set(cacheKey, JSON.stringify(response), { expiry: 10 })
        }

        return next()
      })
    } else {
      res.api_response.data = JSON.parse(data)
      return next()
    }
  })
})

router.use(ResponseHandler.handleResponse)
router.use(ErrorHandler.handleNotFound)
router.use(ErrorHandler.handleError)

module.exports = router
