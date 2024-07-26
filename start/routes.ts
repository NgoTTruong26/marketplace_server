/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import OrderDetailsController from '#modules/order_detail/order_details.controller'
import ProductsController from '#modules/product/products.controller'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const GoogleAuthsController = () => import('#modules/auth/google_auths.controller')
const UsersController = () => import('#modules/user/users.controller')
const UploadsController = () => import('#modules/upload/uploads.controller')
const CategoriesController = () => import('#modules/category/categories.controller')
const CollectionsController = () => import('#modules/collection/collections.controller')
const CartsController = () => import('#modules/cart/carts.controller')
const OrdersController = () => import('#modules/order/orders.controller')

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
// router.post('/categories', [CategoriesController, 'store'])
// router.get('/categories', [CategoriesController, 'index'])

//Collections resource
router.resource('collections', CollectionsController).except(['index']).apiOnly()
router.get('collections', [CollectionsController, 'index']).use(middleware.pagination())
// router.get('collections/:id', [CollectionsController, 'show'])
router
  .get('/top-collections', [CollectionsController, 'getTopCollections'])
  .use(middleware.pagination())
router
  .put('collections/upload-image/:id', [CollectionsController, 'uploadCollectionImage'])
  .where('id', {
    match: /^[0-9]+$/,
    cast: (value) => Number(value),
  })
router.get('collections/infor-user/:id', [CollectionsController, 'getInforUser']).where('id', {
  match: /^[0-9]+$/,
  cast: (value) => Number(value),
})
router.get('collections/users/:id', [CollectionsController, 'getCollectionByUserId']).where('id', {
  match: /^[0-9]+$/,
  cast: (value) => Number(value),
})
router
  .delete('users/:userId/collections/:id', [CollectionsController, 'deleteCollectionByUser'])
  .where('id', {
    match: /^[0-9]+$/,
    cast: (value) => Number(value),
  })
  .where('userId', {
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

router.get('/products/users/:id', [ProductsController, 'getProductCreatedByUser']).where('id', {
  match: /^[0-9]+$/,
  cast: (value) => Number(value),
})

//Order resource
router.resource('orders', OrdersController).apiOnly()

router
  .get('/orders/users/products/:id', [OrdersController, 'getProductIsBuyedByUser'])
  .where('id', {
    match: /^[0-9]+$/,
    cast: (value) => Number(value),
  })

router.get('/orders/users/:id', [OrdersController, 'getOrderByUser']).where('id', {
  match: /^[0-9]+$/,
  cast: (value) => Number(value),
})

//order_detail resource
router.resource('order-details', OrderDetailsController).apiOnly()

router
  .get('/order-details/orders/:id', [OrderDetailsController, 'getListOrderDetailByOrderId'])
  .where('id', {
    match: /^[0-9]+$/,
    cast: (value) => Number(value),
  })

//google Auth
router.post('/auth/user/google', [GoogleAuthsController, 'googleAuth'])

//Middleware check auth
router
  .group(() => {
    //Get user profile
    router
      .group(() => {
        router.get('profile', [UsersController, 'getProfile'])
        router.patch('recharge', [UsersController, 'recharge'])
        router
          .patch('profile', [UsersController, 'updateProfile'])
          .use(middleware.validatorUpdateProfile())
      })
      .prefix('user')
    router
      .group(() => {
        router.get('', [CartsController, 'getCart'])
        router.post('', [CartsController, 'addProductToCart'])
        router.patch('/change-quantity-product', [CartsController, 'changeQuantityProductFromCart'])
        router.delete('', [CartsController, 'removeProductFromCart'])
      })
      .prefix('cart')
    router.get('products-from-cart', [ProductsController, 'getProductsFromCart'])

    router.post('/order', [OrdersController, 'store'])

    router.post('/upload/image', [UploadsController, 'uploadImage'])
    router.post('/upload/multiple-images', [UploadsController, 'uploadMultipleImages'])
  })
  .use(middleware.auth({ guards: ['api'] }))
