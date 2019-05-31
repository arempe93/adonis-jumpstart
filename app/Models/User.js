'use strict'

/*
|--------------------------------------------------------------------------
|  Schema: users
|--------------------------------------------------------------------------
|  id          int(10) unsigned  non-null, primary-key, auto_increment
|  username    varchar(64)       non-null
|  email       varchar(255)      non-null
|  password    varchar(64)       non-null
|  created_at  datetime
|  updated_at  datetime
|
|  Indexes
|
|  users_email_unique (email)  UNIQUE
|  users_username_unique (username)  UNIQUE
|
*/

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addTrait('HasPassword')
  }
}

module.exports = User
