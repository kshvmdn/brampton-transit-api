'use strict'
const redis = require('redis')
const logger = require('./../utils/logger')

const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'

const client = redis.createClient(REDIS_PORT, REDIS_HOST)

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

module.exports = client
