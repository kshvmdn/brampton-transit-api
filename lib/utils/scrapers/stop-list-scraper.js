'use strict'
const cheerio = require('cheerio')

const fetch = require('./../fetch')
const constants = require('./../../constants')

class StopListScraper {
  static _fetch (options, cb) {
    if (!cb) {
      return fetch(constants.DESKTOP.url, options)
    }

    fetch(constants.DESKTOP.url, options)
      .then(response => cb(null, response))
      .catch(error => cb(error))
  }

  static _parse (html, filters = {}) {
    return new Promise((resolve, reject) => {
      let $ = cheerio.load(html)

      let routes = $('body').find(`#${constants.DESKTOP.elements.dom.routes.id}`)

      if (!routes || routes.length <= 0) {
        let e = new Error('Failed to retrieve routes.')
        e.status = 400
        return reject(e)
      }

      let responses = (routes.find('option').slice(1).map((i, route) => {
        route = $(route)

        let routeId = route.attr('value')
        let [routeNumber, routeName] = route.text().split('-').map(s => s.trim())

        if ((filters.routeNumber && filters.routeNumber !== routeNumber) || (filters.routeName && !routeName.toLowerCase().includes(filters.routeName))) {
          return
        }

        return {
          route_id: routeId,
          route: routeNumber,
          route_name: routeName,
          stops: []
        }
      }).get()).filter(Boolean)

      let promises = responses.map(response => {
        return new Promise((rResolve, rReject) => { /* eslint promise/param-names: 0 */
          let payload = Object.assign(constants.DESKTOP.payload, {
            [constants.DESKTOP.elements.dom.routes.name]: response.route_id
          })

          StopListScraper._fetch({ payload }, (err, res) => {
            if (err) {
              // return rReject(err)
              return rResolve(response)
            }

            let $$ = cheerio.load(res.body)

            let stops = $$('body').find(`#${constants.DESKTOP.elements.dom.stops.id}`)

            let parsedStops = (stops.find('option').slice(1).map((i, stop) => {
              stop = $$(stop)
              let [stopCode, stopName] = stop.text().split(',').map(s => s.trim())

              if ((filters.stopCode && filters.stopCode != stopCode) || (filters.stopName && !stopName.toLowerCase().includes(filters.stopName))) { /* eslint eqeqeq:0 */
                return
              }

              return {
                stop: stopCode,
                stop_name: stopName
              }
            }).get()).filter(Boolean)

            rResolve(Object.assign(response, { stops: parsedStops }))
          })
        })
      })

      Promise.all(promises).then(routes => resolve(routes), reason => reject(reason))
    })
  }

  static scrape (filters, cb) {
    if (filters instanceof Function) {
      cb = filters
      filters = {}
    }

    StopListScraper._fetch({ payload: constants.DESKTOP.payload })
      .then(response => StopListScraper._parse(response.body, filters))
      .then(parsed => cb(null, parsed))
      .catch(error => cb(error))
  }
}

module.exports = StopListScraper
