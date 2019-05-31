'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { request, response }) {
    response.status(error.status).send({
      code: error.code,
      message: error.message,
      status: error.status
    })
  }
}

module.exports = ExceptionHandler
