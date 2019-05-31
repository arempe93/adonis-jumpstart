const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Request = use('Adonis/Src/Request')

  Request.macro('store', function (key, value) {
    this._requestStore = this._requestStore || {}

    if (value) {
      return this._requestStore[key] = value
    }

    return this._requestStore[key]
  })
})
