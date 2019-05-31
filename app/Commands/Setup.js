'use strict'

const { call, Command } = require('@adonisjs/ace')

const base32 = require('base32')
const crypto = require('crypto')
const util = require('util')

const Helpers = use('Helpers')

const ENV_TEMPLATE = `
NODE_ENV=%s

HOST=127.0.0.1
PORT=%i
APP_URL=http://\${HOST}:\${PORT}
APP_KEY=%s

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=%s
DB_PASSWORD=%s
DB_DATABASE=%s
DB_DEBUG=false
`.trim()

class Setup extends Command {
  static get signature () {
    return 'setup'
  }

  static get description () {
    return 'Configure dev environment for first-time setup'
  }

  async handle (args, options) {
    const serverPort = await this
      .ask('Enter local server port', 3000)

    const mysqlUser = await this
      .ask('Enter mysql username', 'root')

    let mysqlPass = await this
      .secure('Enter mysql password')

    mysqlPass = mysqlPass || ''

    const mysqlDatabase = await this
      .ask('Enter mysql database', 'adonis')

    const promptAppKey = await this
      .choice('App key', [
        { name: 'Automatically generated', value: 'auto' },
        { name: 'Manual entry', value: 'manual' }
      ])

    const appKey = promptAppKey === 'manual'
      ? await this.ask('Enter app key')
      : base32.encode(crypto.randomBytes(16))

    const opts = [serverPort, appKey, mysqlUser, mysqlPass]

    const devEnv = `${util.format(ENV_TEMPLATE, 'development', ...opts, mysqlDatabase)}\n`
    await this.writeFile(Helpers.appRoot('.env'), devEnv)
    this.completed('create', '.env')

    const testEnv= `${util.format(ENV_TEMPLATE, 'testing', ...opts, `${mysqlDatabase}_test`)}\n`
    await this.writeFile(Helpers.appRoot('.env.testing'), testEnv)
    this.completed('create', '.env.testing')
  }
}

module.exports = Setup
