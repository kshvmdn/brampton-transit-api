'use strict'

/**
 * Verify that access key exists and is valid.
 */
function verifyKey (req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    return next()
  }

  return next()

  // TODO (?) - verify that key exists & correct

  // let e = new Error()
  // let key = req.body.key || req.query.key || req.headers['x-access-key']

  // if (!key) {
  //   e.message = 'No key provided.'
  //   e.status = 403
  //   return next(e)
  // }
}

module.exports = exports = verifyKey
