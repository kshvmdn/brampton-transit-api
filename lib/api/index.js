'use strict'
const { Router } = require('express')

const client = require('./../config/redis')

const StopScraper = require('./../utils/scrapers/stop-scraper')
const SearchScraper = require('./../utils/scrapers/search-scraper')
const StopListScraper = require('./../utils/scrapers/stop-list-scraper')

const CacheWorker = require('./../utils/cache-worker')
const logger = require('./../utils/logger')

const router = new Router()
const cw = new CacheWorker(client)

/**
 * Retreive a list of routes. Provide query parameter `code` to filter
 * routes by code or `name` to filter by name.
 */
router.get('/routes', (req, res, next) => {
  let cacheKey = 'routes'

  let routeName
  let routeNumber
  let query = {}

  if (req.query.name && req.query.name.trim().length > 0) {
    routeName = req.query.name.toLowerCase().trim()
    cacheKey = `${cacheKey}:name:${routeName.replace(/(,|\s)+/g, '_')}`
    query['routeName'] = routeName
  }

  if (req.query.code && req.query.code.trim().length > 0) {
    routeNumber = req.query.code.trim()
    cacheKey = `${cacheKey}:number:${routeNumber}`
    query['routeNumber'] = routeNumber
  }

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: \`${cacheKey}\`.`)
      StopListScraper.scrape(query, (error, response) => {
        if (error) {
          return next(error)
        }

        response = response.map(item => {
          try {
            return {
              route: item.route,
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

/**
 * Retrieve a list of all stops separated by route.
 */
router.get('/stops', (req, res, next) => {
  let cacheKey = 'stops:all'

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: \`${cacheKey}\`.`)
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

/**
 * Retrieve a list of stops matching the provided route filters.
 * Use parameter `code` to filter by route code, `name` for route name.
 */
router.get('/stops/route', (req, res, next) => {
  if (!(req.query.name || req.query.code)) {
    let error = new Error('Expected at least one parameter.')
    error.status = 400
    return next(error)
  }

  let cacheKey = 'stops:route'
  let query = {}

  let routeName
  let routeNumber

  if (req.query.name && req.query.name.trim().length > 0) {
    routeName = req.query.name.toLowerCase().trim()
    cacheKey = `${cacheKey}:name:${routeName.replace(/(,|\s)+/g, '_')}`
    query['routeName'] = routeName
  }

  if (req.query.code && req.query.code.trim().length > 0) {
    routeNumber = req.query.code.trim()
    cacheKey = `${cacheKey}:number:${routeNumber}`
    query['routeNumber'] = routeNumber
  }

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: \`${cacheKey}\`.`)
      StopListScraper.scrape(query, (error, response) => {
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

/**
 * Retrieve a list of stops matching the provided stop filters.
 * Use parameter `code` to filter by stop code, `name` for stop name.
 */
router.get('/stops/stop', (req, res, next) => {
  if (!(req.query.name || req.query.code)) {
    let error = new Error('Expected at least one parameter.')
    error.status = 400
    return next(error)
  }

  let cacheKey = 'stops:stop'
  let query = {}

  let stopName
  let stopCode

  if (req.query.name && req.query.name.trim().length > 0) {
    stopName = req.query.name.toLowerCase().trim()
    cacheKey = `${cacheKey}:route:${stopName.replace(/(,|\s)+/g, '_')}`
    query['stopName'] = stopName
  }

  if (req.query.code && req.query.code.trim().length > 0) {
    stopCode = req.query.code.trim()
    cacheKey = `${cacheKey}:code:${stopCode}`
    query['stopCode'] = stopCode
  }

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: \`${cacheKey}\`.`)
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

/**
 * Retrieve a list of stops matching the query.
 */
router.get('/search/stops/:query', (req, res, next) => {
  let query = req.params.query
  let cacheKey = `search:stops:${query}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: \`${cacheKey}\`.`)
      SearchScraper.scrape(query, (error, response) => {
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

/**
 *
 */
router.get('/stop/:stop', (req, res, next) => {
  let stop = req.params.stop
  let cacheKey = `stop:${stop}`

  cw.get(cacheKey, (err, data) => {
    if (err || !data) {
      logger.debug(`Scraping, key: \`${cacheKey}\`.`)
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

module.exports = router
