'use strict'
const got = require('got')

function fetch (url, opts = {}) {
  let body = Object.assign({}, opts.payload)

  let headers = Object.assign({
    Host: 'nextride.brampton.ca',
    Origin: 'http://nextride.brampton.ca',
    Referer: 'http://nextride.brampton.ca/RealTime.aspx',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
  }, opts.headers)

  return got.post(url, { body, headers })
}

module.exports = fetch
