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
import { middleware } from './kernel.js'

const GoogleAuthsController = () => import('#modules/auth/google_auths.controller')

router.get('/', (ctx: HttpContext) => {
  const { request, response } = ctx
  console.log(request.url())
  console.log(request.headers())
  console.log(request.qs())
  console.log(request.body())

  response.send('hello world')
  response.send({ hello: 'world' })
})

router.post('/auth/user/google', [GoogleAuthsController, 'googleAuth'])

router
  .get('/auth', async (ctx) => {
    const user = ctx.auth.user!
    return user
  })
  .use(middleware.auth({ guards: ['api'] }))
