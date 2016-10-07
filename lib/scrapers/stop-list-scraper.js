'use strict'
const cheerio = require('cheerio')

const fetch = require('./../utils/fetch')
const constants = require('./../constants')

const noop = () => {}

class StopListScraper {
  static _fetch(options, cb) {
    console.log('Making request.')

    if (!cb) {
      return fetch(constants.DESKTOP.url, options)
    }

    fetch(constants.DESKTOP.url, options)
      .then(response => cb(null, response))
      .catch(error => cb(error))
  }

  static _parse(html) {
    return new Promise((resolve, reject) => {
      let $ = cheerio.load(html)

      let routes = $('body').find(`#${constants.DESKTOP.elements.dom.routes.id}`)

      if (!routes || routes.length <= 0) {
        let e = new Error('Failed to retrieve routes.')
        e.status = 400
        return reject(e)
      }

      let response = routes.find('option').slice(1).map((i, route) => {
        route = $(route)

        let routeId = route.attr('value')
        let [routeNumber, routeName] = route.text().split('-').map(s => s.trim())

        let payload = Object.assign(constants.DESKTOP.payload, {
          [constants.DESKTOP.elements.dom.routes.name]: routeId
        })

        let routeResponse = {
          route_id: routeId,
          routeNumber: routeNumber,
          routeName: routeName,
          stops: []
        }

        StopListScraper._fetch({ payload })
        .then(res => {
          let $$ = cheerio.load(res.body)

          let stops = $$('body').find(`#${constants.DESKTOP.elements.dom.stops.id}`)

          routeResponse.stops.append(stops.find('option').slice(1).map((i, stop) => {
            stop = $(stop)

            console.log($(stop).text())

            let [stopCode, stopName] = stop.text().split(',').map(s => s.trim())

            return {
              stop: stopCode,
              stop_name: stopName
            }
          }).get())
        })
        .catch(error => {
          console.error(error)
          process.exit(1)
        })

        return routeResponse
      }).get()

      resolve(response)
    })
  }

  static _scrape(cb) {
    StopListScraper._fetch({ payload: constants.DESKTOP.payload })
      .then(response => StopListScraper._parse(response.body))
      .then(parsed => cb(null, parsed))
      .catch(error => cb(error))
  }
}

StopListScraper._scrape((err, res) => {
  if (err) {
    console.error(err)
    return
  }

  console.log('RES', res)
})

module.exports = StopListScraper
