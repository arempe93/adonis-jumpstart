'use strict'

const base32 = require('base32')
const crypto = require('crypto')

class RequestId {
  async handle ({ response, request }, next) {
    request.store('id', this.generateId())
    response.header('X-Request-Id', request.store('id'))

    await next()
  }

  generateId () {
    return base32.encode(crypto.randomBytes(8))
  }
}

module.exports = RequestId
