const PythonShell = require('python-shell');

module.exports = stop => {
  return new Promise((resolve, reject) => {
    let options = {
      mode: 'json',
      scriptPath: './lib/scraper',
      args: [stop]
    };

    let script = ''; // __main__.py

    PythonShell.run(script, options, (err, results) => {
      let result = results && results[0] ? results[0] : null;

      if (err || !result) {
        let e = err || new Error(`Can't get data for stop ${stop}.`);
        e.status = err && err.status ? err.status : 400;
        reject(e);
      }

      resolve(result);
    });
  })
};
