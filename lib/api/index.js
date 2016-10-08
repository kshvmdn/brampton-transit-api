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
  let cacheKey = `routes:all`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopListScraper.scrape((error, response) => {
        if (error) {
          return next(error)
        }

        response = response.map(item => {
          try {
            return {
              route: item.route_number,
              route_name: item.route_name
            }
          } catch (e) {
            return
          }
        }).filter(Boolean)

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 * 7 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/stops', (req, res, next) => {
  let cacheKey = `stops:all`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopListScraper.scrape((error, response) => {
        if (error) {
          return next(error)
        }

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 * 7 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/stops/route/name/:route_name', (req, res, next) => {
  let routeName = req.params.route_name
  let cacheKey = `stops:route:name:${routeName}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopListScraper.scrape({ routeName }, (error, response) => {
        if (error) {
          return next(error)
        }

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 * 7 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/stops/route/:route_number', (req, res, next) => {
  let routeNumber = req.params.route_number
  let cacheKey = `stops:route:${routeNumber}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopListScraper.scrape({ routeNumber }, (error, response) => {
        if (error) {
          return next(error)
        }

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 * 7 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/stops/stop/name/:stop_name', (req, res, next) => {
  let stopName = req.params.stop_name
  let cacheKey = `stops:stop:name:${stopName}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopListScraper.scrape({ stopName }, (error, response) => {
        if (error) {
          return next(error)
        }

        response = response.filter(o => o.stops && o.stops.length > 0)
        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 * 7 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/stops/stop/:stop_code', (req, res, next) => {
  let stopCode = req.params.stop_code
  let cacheKey = `stops:stop:${stopCode}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopListScraper.scrape({ stopCode }, (error, response) => {
        if (error) {
          return next(error)
        }

        response = response.filter(o => o.stops && o.stops.length > 0)
        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 24 * 60 * 60 * 7 })
        return next()
      })
    } else {
      res.api.data = JSON.parse(data)
      return next()
    }
  })
})

router.get('/search/stops/:query', (req, res, next) => {
  let query = req.params.query
  let cacheKey = `search:stops:${query}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: ${cacheKey}.`)
      SearchScraper.scrape(query, (error, response) => {
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
      logger.debug(`Scraping, key: ${cacheKey}.`)
      StopScraper.scrape(stop, (error, response) => {
        if (error) {
          return next(error)
        }

        res.api.data = response
        cw.set(cacheKey, JSON.stringify(response), { expiry: 30 })
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
