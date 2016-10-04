'use strict'
const got = require('got')

function fetch (url, opts = {}) {
  let body = Object.assign({}, opts.payload)
  let headers = Object.assign({}, opts.headers)
  return got.post(url, { body, headers })
}

module.exports = fetch
