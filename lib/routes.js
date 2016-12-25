const { Router } = require('express')

const api = require('./api')
const { VERSION } = require('./constants')
const ResponseHandler = require('./middleware/handle-api-response')
const ErrorHandler = require('./middleware/handle-api-error')

const router = new Router()

router.use((req, res, next) => {
  res.api = {}
  next()
})

router.use(`/api/${VERSION}`, api)

router.use(ResponseHandler.handleResponse)
router.use(ErrorHandler.handleNotFound)
router.use(ErrorHandler.handleError)

module.exports = router
