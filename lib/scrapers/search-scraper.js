'use strict'
const cheerio = require('cheerio')

const fetch = require('./../utils/fetch')
const constants = require('./../constants')

class SearchScraper {
  static fetch (query) {
    let options = {
      payload: Object.assign(constants.MOBILE.payload, {
        [constants.MOBILE.elements.form.submit_button]: true,
        [constants.MOBILE.elements.form.stop_input]: query
      })
    }

    return fetch(constants.MOBILE.url, options)
  }

  static parse (html) {
    return new Promise((resolve, reject) => {
      let $ = cheerio.load(html)

      let error = $('body').find(`#${constants.MOBILE.elements.dom.error}`)
      let stops = $('body').find(`#${constants.MOBILE.elements.dom.stop_select}`)

      if (error.length > 0 || !stops || stops.length <= 0) {
        let e = new Error('Failed to retrieve search results.')
        e.status = 400
        return reject(e)
      }


      let response = stops.find('option').slice(1).map((i, option) => {
        option = $(option)

        let stop = option.attr('value')
        let stopName = option.text().split(',')[1].trim()

        if (!(stop && stopName)) {
          return {}
        }

        return {
          stop,
          stop_name: stopName
        }
      }).get()

      return resolve(response)
    })
  }

  static scrape (stop, cb) {
    SearchScraper.fetch(stop)
      .then(response => SearchScraper.parse(response.body))
      .then(parsed => cb(null, parsed))
      .catch(error => cb(error))
  }
}

module.exports = SearchScraper
