'use strict'

class RouteParams {
  async handle (ctx, next) {
    await next()
  }
}

module.exports = RouteParams
