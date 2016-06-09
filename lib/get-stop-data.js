const PythonShell = require('python-shell');

module.exports = stop => {
  return new Promise((resolve, reject) => {
    let options = {
      mode: 'json',
      scriptPath: './lib/scraper',
      args: [stop]
    };

    PythonShell.run('', options, (err, results) => {
      let result = results ? results[0] : null;

      if (err) {
        reject(err);
      }

      if (!result) {
        let err = new Error(`Can't get data for stop ${stop}.`);
        err.status = 400;
        reject(err);
      }

      resolve(result);
    });
  })
};
