import HttpStatusCode from '#responses/HttpStatusCode'
import { createOrderValidator } from '#validators/order'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'
import OrderService from './order.service.js'

@inject()
export default class OrdersController {
  constructor(private orderService: OrderService) {}
  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    ctx.response.status(HttpStatusCode.OK).send({
      message: 'List of orders',
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store(ctx: HttpContext) {
    try {
      const orderDTO = await createOrderValidator.validate(ctx.request.all())

      // console.log(orderDTO)
      const order = await this.orderService.createOrder(orderDTO)
      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Order created',
        data: order,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'Cannot find user or product',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Order not found',
          error: error.messages,
        })
      }
    }
  }

  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}

  // /**
  //  * Delete record
  //  */
  // async destroy({ params }: HttpContext) {}
}
