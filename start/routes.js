'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

const Users = use('App/Api/Users')

Route.get('/routes', () => {
  return Route.list()
})

Route.group(() => {
  Users(Route)
})
  .prefix('/api')
