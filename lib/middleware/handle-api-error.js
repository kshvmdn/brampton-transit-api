class ErrorHandler {
  /**
   * Handle page not found error.
   */
  static handleNotFound (req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    return next(err)
  }

  /**
   * Handle a erroneous request.
   */
  static handleError (err, req, res, next) {
    let response = {
      error: {
        code: err.status || 500,
        message: err.message || 'Unexpected Error'
      }
    }

    res.status(response.error.code).json(response)
  }
}

module.exports = ErrorHandler
