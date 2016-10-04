class ErrorHandler {
  static handleNotFound (req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    return next(err)
  }

  static handleError (err, req, res, next) {
    let response = {
      data: null,
      status: {
        code: err.status || 500,
        message: err.message || 'Unexpected Error'
      }
    }

    res.status(response.status.code).json(response)
  }
}

module.exports = ErrorHandler
