// import type { HttpContext } from '@adonisjs/core/http'

import HttpStatusCode from '#responses/HttpStatusCode'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import CartService from './cart.service.js'

@inject()
export default class CartsController {
  constructor(private cartService: CartService) {}

  async addProductToCart(ctx: HttpContext) {
    try {
      const data = await this.cartService.addProductToCart(ctx.auth.user!.id, {
        productId: ctx.request.body().productId,
      })
      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Add product to cart successfully',
        data: data,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: error.message,
        error: error.messages,
      })
    }
  }

  async removeProductFromCart(ctx: HttpContext) {
    try {
      const data = await this.cartService.removeProductFromCart({
        productId: ctx.request.body().productId,
        cartId: ctx.request.body().cartId,
      })
      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Remove product from cart successfully',
        data: data,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: error.message,
        error: error.messages,
      })
    }
  }

  async getCart(ctx: HttpContext) {
    try {
      const data = await this.cartService.getCart({ userId: ctx.auth.user!.id, ...ctx.pagination })

      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Success',
        data: data,
      })
    } catch (error) {
      console.log(error)

      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'FAILED',
        error: error.messages,
      })
    }
  }
}
