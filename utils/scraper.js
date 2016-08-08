const PythonShell = require('python-shell');

class Scraper {
  static run(opts, cb) {
    const options = Object.assign({
      mode: 'json',
      pythonPath: 'python3',
      scriptPath: './lib/scraper',
    }, opts)

    const script = '' // __main__.py

    PythonShell.run(script, options, (error, results) => cb(error, results))
  }

  static getStopData(stop) {
    return new Promise((resolve, reject) => {
      const options = {
        args: [stop],
      };

      Scraper.run(options, (error, results) => {
        const result = results && results[0] ? results[0] : null;

        if (error || !result) {
          const e = error || new Error(`Failed to retrieve data for Stop ${stop}.`);
          e.status = error && error.status ? error.status : 400;
          return reject(e);
        }

        return resolve(result);
      });
    });
  }

  static getStopsList() {
    console.log('Scraping stops list...')
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'text',
      };

      Scraper.run(options, (error, results) => {
        const result = results && results[0] ? results[0] : null;

        if (error || !result) {
          const e = error || new Error(`Failed to retrieve data.`);
          e.status = error && error.status ? error.status : 400;
          return reject(e);
        }

        return resolve(result);
      });
    });
  }
}

module.exports = Scraper;
