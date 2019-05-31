'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  |
  | Driver to be used for hashing values. The same driver is used by the
  | auth module too.
  |
  */
  driver: 'bcrypt',

  /*
  |--------------------------------------------------------------------------
  | Bcrypt
  |--------------------------------------------------------------------------
  |
  | Config related to bcrypt hashing. https://www.npmjs.com/package/bcrypt
  | package is used internally.
  |
  */
  bcrypt: {
    rounds: 10
  }
}
