'use strict'

const { test, trait } = use('Test/Suite')('Users Api')

const Factory = use('Factory')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('get a list of users', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client.get('/api/users').end()

  response.assertStatus(200)
  response.assertJSONSubset({
    users: [
      {
        username: user.username
      }
    ]
  })
})
