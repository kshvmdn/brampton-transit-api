const express = require('express')
const Scraper = require('./../utils/scraper')

const router = new express.Router()

router.get('/', (req, res) => {
  let response = {
    data: {
      endpoints: {
        list: {
          description: 'List all Brampton Transit stops.',
          url: '/api/list'
        },
        stop: {
          description: 'Real-time schedules for a stop.',
          url: '/api/stop/:stop'
        }
      },
      source: {}
    },
    meta: {
      status: 203,
      message: 'OK'
    }
  }
  res.status(response.meta.status).json(response)
})

router.get('/list', (req, res, next) => {
  let response = {
    data: null,
    meta: {
      status: 501,
      message: 'Not yet implemented.'
    }
  }
  res.status(response.meta.status).json(response)
})

router.get('/stop', (req, res, next) => {
  let stops = void 0

  try {
    stops = require('../data/stops.json')

    if (!stops) throw new Error('Failed to retrieve stop data.')
  } catch (e) {
    let err = new Error('Failed to retrieve stop data.')
    err.status = 503
    return next(err)
  }

  let response = {
    data: stops,
    meta: {
      status: 200,
      message: 'OK'
    }
  }

  res.status(response.meta.status).json(response)
})

router.get('/stop/:stop', (req, res, next) => {
  Scraper.getStopData(req.params.stop)
    .then((data) => {
      let response = {
        data,
        meta: {
          status: 200,
          message: 'OK'
        }
      }
      res.status(response.meta.status).json(response)
    })
    .catch((e) => next(e))
})

router.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

router.use((err, req, res, next) => {
  let message = err.message || 'Unexpected Error'
  let status = err.status || 500

  let response = {
    data: null,
    meta: { status, message }
  }

  res.status(status).json(response)
})

module.exports = router
