/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

router.get('/', (ctx: HttpContext) => {
  const { request, response } = ctx
  console.log(request.url())
  console.log(request.headers())
  console.log(request.qs())
  console.log(request.body())

  response.send('hello world')
  response.send({ hello: 'world' })
})
