'use strict'

const User = use('App/Models/User')

module.exports = (Route) => {
  Route.get('/users', async ({ request }) => {
    return {
      users: await User.all()
    }
  })

  Route.post('/users', async ({ request }) => {
    const user = new User()
    const all = request.all()

    user.username = all.username
    user.email = all.email
    user.password = all.password

    await user.save()

    return { user }
  })

  Route.get('/users/:id', async ({ params, request }) => {
    return {
      user: await User.findOrFail(params.id)
    }
  })

  Route.put('/users/:id', async ({ params, request }) => {
    const user = await User.findOrFail(params.id)
    const all = request.all()

    if (all.username) user.username = all.username
    if (all.email) user.email = all.email
    if (all.password) user.password = all.password

    await user.save()

    return { user }
  })
}
