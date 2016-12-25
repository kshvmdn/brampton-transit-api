'use strict'

const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'

module.exports = exports = {
  DESKTOP: require('./scrape/desktop'),
  MOBILE: require('./scrape/mobile'),

  VERSION: 'v1',

  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',

  REDIS_URL: process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`
}
