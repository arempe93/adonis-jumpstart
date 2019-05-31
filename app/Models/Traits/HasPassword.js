'use strict'

const Hash = use('Hash')

class HasPassword {
  register (Model, options = {}) {
    Model.addHook('beforeSave', async (instance) => {
      if (instance.dirty.password) {
        instance.password = await Hash.make(instance.password)
      }
    })

    Model.prototype.validPassword = function(password) {
      return Hash.verify(password, this.password)
    }
  }
}

module.exports = HasPassword
