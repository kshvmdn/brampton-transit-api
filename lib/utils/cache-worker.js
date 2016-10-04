'use strict'

const noop = () => {}

class CacheWorker {
  /**
   * Instantiate a new CacheWorker class.
   * @param {Object} client - Redis client
   */
  constructor (client) {
    this.client = client
  }

  /**
   * Insert a new document.
   * @param {string}   key - The document key
   * @param {any}      value - The document value
   * @param {Object}   opts - Object of options
   * @param {Function} cb - Optional callback
   */
  set (key, value, opts = {}, cb = noop) {
    this.client.set(key, value, 'EX', opts.expiry || 1, cb)
  }

  /**
   * Retrieve a document.
   * @param {string}   key - Key to be retrieved.
   * @param {Function} cb - Optional callback
   */
  get (key, cb = noop) {
    this.client.get(key, cb)
  }
}

module.exports = CacheWorker
