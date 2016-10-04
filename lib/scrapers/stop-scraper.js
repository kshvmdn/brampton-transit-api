'use strict'
const cheerio = require('cheerio')

const fetch = require('./../utils/fetch')
const constants = require('./../constants')

class StopScraper {
  static fetch (stop) {
    let options = {
      payload: Object.assign(constants.MOBILE.payload, {
        [constants.MOBILE.elements.form.submit_button]: true,
        [constants.MOBILE.elements.form.stop_input]: stop
      })
    }

    return fetch(constants.MOBILE.url, options)
  }

  static parse (html) {
    return new Promise((resolve, reject) => {
      let response = {}

      let $ = cheerio.load(html)

      let error = $('body').find(`#${constants.MOBILE.elements.dom.error}`)
      let description = $('body').find(`#${constants.MOBILE.elements.dom.description}`)
      let results = $('body').find(`#${constants.MOBILE.elements.dom.results}`)

      if (error.length > 0) {
        let e = new Error(error.text())
        e.status = 400
        return reject(e)
      }

      if (description.length < 0) {
        return reject(new Error('Unexpected error'))
      }

      let [stopNumber, stopName] = description.text().split(',').map(s => s.trim())
      let stop = stopNumber.replace('Stop', '').trim()

      response.stop = stop
      response.stop_name = stopName
      response.routes = []

      if (results.length < 0 || results.find('tr').length < 0) {
        return resolve(response)
      }

      response.routes = results.find('tr').slice(1).map((i, tr) => {
        let [name, eta] = Array.from($(tr).find('td'))

        let [id, direction] = $(name).text().split('to').map(s => s.trim())

        return {
          route: id.replace('Route', '').trim(),
          direction,
          eta: $(eta).text()
        }
      }).get()

      resolve(response)
    })
  }

  static scrape (stop, cb) {
    StopScraper.fetch(stop)
      .then(response => StopScraper.parse(response.body))
      .then(parsed => cb(null, parsed))
      .catch(error => cb(error))
  }
}

module.exports = StopScraper
