class ResponseHandler {
  /**
   * Handle API response - wrap JSON response in data object, add status obj.
   */
  static handleResponse (req, res, next) {
    let response = {
      data: res.api_response.data || null,
      status: {
        code: res.api_response.status || 200,
        message: res.api_response.message || 'OK'
      }
    }

    res.status(response.status.code).json(response)
  }
}

module.exports = ResponseHandler
