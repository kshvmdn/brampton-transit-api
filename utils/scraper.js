const PythonShell = require('python-shell')

class Scraper {
  static run (opts, cb, script = '') {
    let options = Object.assign({
      mode: 'json',
      pythonPath: 'python3',
      scriptPath: './lib/scraper'
    }, opts)

    PythonShell.run(script, options, (error, results) => {
      if (error) throw error
      cb(error, results)
    })
  }

  static getStopData (stop) {
    return new Promise((resolve, reject) => {
      let options = {
        args: [stop]
      }

      Scraper.run(options, (error, results) => {
        let result = results && results[0] ? results[0] : null

        if (error || !result) {
          let e = error || new Error(`Failed to retrieve data for stop ${stop}.`)
          e.status = error && error.status ? error.status : 400
          return reject(e)
        }

        return resolve(result)
      })
    })
  }

  static getStopList () {
    console.log('Scraping stops list...')
    return new Promise((resolve, reject) => {
      let options = {
        mode: 'text'
      }

      Scraper.run(options, (error, results) => {
        let result = results && results[0] ? results[0] : null

        if (error || !result) {
          let e = error || new Error('Failed to retrieve data.')
          e.status = error && error.status ? error.status : 400
          return reject(e)
        }

        return resolve(result)
      })
    })
  }
}

module.exports = Scraper