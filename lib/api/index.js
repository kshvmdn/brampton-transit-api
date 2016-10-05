'use strict'
const express = require('express')

// CONFIG
const client = require('./../config/redis')

// MIDDLEWARE
const ResponseHandler = require('./../middleware/handle-api-response')
const ErrorHandler = require('./../middleware/handle-api-error')
const verifyKey = require('./../middleware/verify-key')

// SCRAPERS
const StopScraper = require('./../scrapers/stop-scraper')
const SearchScraper = require('./../scrapers/search-scraper')
const StopListScraper = require('./../scrapers/stop-list-scraper')

// UTILS
const CacheWorker = require('./../utils/cache-worker')
const logger = require('./../utils/logger')

const router = express.Router()
const cw = new CacheWorker(client)

router.use((req, res, next) => {
  res.api = {}
  next()
})

router.use(verifyKey)

router.get('/routes', (req, res, next) => {
  res.send('/routes')
  // TODO
})

router.get('/stops', (req, res, next) => {
  res.send('/stops')
  // TODO
})

router.get('/stops/:route', (req, res, next) => {
  res.send(`/stops/${req.params.route}`)
  // TODO
})

router.get('/search/stops/:query', (req, res, next) => {
  let query = req.params.query
  let cacheKey = `search:stops:${query}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      SearchScraper.scrape(query, (error, response) => {
        logger.debug(`Scraping, key: ${cacheKey}`)
        if (error) {
          return next(error)
        }

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/stop/:stop', (req, res, next) => {
  let stop = req.params.stop
  let cacheKey = `stop:${stop}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      StopScraper.scrape(stop, (error, response) => {
        logger.debug(`Scraping, key: ${cacheKey}`)
        if (error) {
          return next(error)
        }

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 15 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.use(ResponseHandler.handleResponse)
router.use(ErrorHandler.handleNotFound)
router.use(ErrorHandler.handleError)

module.exports = router
