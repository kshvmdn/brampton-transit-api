const PythonShell = require('python-shell');

class Scraper {
  static getStopData(stop) {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'json',
        scriptPath: './lib/scraper',
        args: [stop],
      };

      const script = ''; // __main__.py

      PythonShell.run(script, options, (err, results) => {
        const result = results && results[0] ? results[0] : null;

        if (err || !result) {
          const e = err || new Error(`Failed to retrieve data for Stop ${stop}.`);
          e.status = err && err.status ? err.status : 400;
          return reject(e);
        }

        return resolve(result);
      });
    });
  }
}

module.exports = Scraper
