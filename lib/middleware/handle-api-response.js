class ResponseHandler {
  /**
   * Handle API response - wrap JSON response in data object, add status.
   */
  static handleResponse (req, res, next) {
    if (Object.keys(res.api).length === 0) {
      return next()
    }

    let response = {
      data: res.api.data || null,
      status: {
        code: res.api.status || 200,
        message: res.api.message || 'OK'
      }
    }

    res.status(response.status.code).json(response)
  }
}

module.exports = ResponseHandler
