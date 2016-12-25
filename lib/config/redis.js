'use strict'
const redis = require('redis')
const logger = require('./../utils/logger')
const { REDIS_URL } = require('./../constants')

const client = redis.createClient(REDIS_URL)

client.on('connect', () => {
  logger.info(`Connected to Redis server @ ${client.address}.`)
})

client.on('error', (e) => {
  if (e.code === 'ECONNREFUSED') {
    logger.error(`Error connecting to Redis server @ ${client.address}.`)
  } else {
    logger.error(e.message)
  }

  process.exit(1)
})

module.exports = exports = client
