/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import CategoriesController from '#modules/category/categories.controller'
import CollectionsController from '#modules/collection/collections.controller'
import OrdersController from '#modules/order/orders.controller'
import OrderDetailsController from '#modules/order_detail/order_details.controller'
import ProductsController from '#modules/product/products.controller'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const GoogleAuthsController = () => import('#modules/auth/google_auths.controller')
const UsersController = () => import('#modules/user/users.controller')
const UploadsController = () => import('#modules/upload/uploads.controller')

router.get('/', (ctx: HttpContext) => {
  const { request, response } = ctx
  debugger
  console.log(request.url())
  console.log(request.headers())
  console.log(request.qs())
  console.log(request.body())
  // eslint-disable-next-line no-debugger
  debugger

  response.send('hello world')
  response.send({ hello: 'world' })
})

// router.get('/users/:id', async ({ response, params }: HttpContext) => {
//   debugger
//   response.send(`User ID: ${params.id}`)
// })

//Categories resource
router.resource('categories', CategoriesController).apiOnly()

//Collections resource
router.resource('collections', CollectionsController).except(['index']).apiOnly()
router.get('collections', [CollectionsController, 'index']).use(middleware.pagination())
router
  .put('collections/upload-image/:id', [CollectionsController, 'uploadCollectionImage'])
  .where('id', {
    match: /^[0-9]+$/,
    cast: (value) => Number(value),
  })

//Products resource
router.resource('products', ProductsController).except(['index']).apiOnly()
router.get('products', [ProductsController, 'index']).use(middleware.pagination())
router.put('products/upload-image/:id', [ProductsController, 'uploadProductImage']).where('id', {
  match: /^[0-9]+$/,
  cast: (value) => Number(value),
})

//Order resource
router.resource('orders', OrdersController).apiOnly()

//order_detail resource
router.resource('order-details', OrderDetailsController).apiOnly()

//google Auth
router.post('/auth/user/google', [GoogleAuthsController, 'googleAuth'])

router.post('/upload/image', [UploadsController, 'uploadImage'])

router.post('/upload/multiple-images', [UploadsController, 'uploadMultipleImages'])

//Middleware check auth
router
  .group(() => {
    //Get user profile
    router.get('/user/profile', [UsersController, 'getProfile'])
  })
  .use(middleware.auth({ guards: ['api'] }))
