'use strict'
const noop = () => {}

class CacheWorker {
  constructor (client) {
    this.client = client
  }

  set (key, value, opts = {}, cb = noop) {
    this.client.set(key, value, 'EX', opts.expiry || 1, cb)
    return value
  }

  get (key, cb = noop) {
    this.client.get(key, cb)
  }
}

module.exports = CacheWorker
