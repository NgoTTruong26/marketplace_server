// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateProfileDTO } from './dto/update_profile.dto.js'
import UsersService from './user.service.js'

@inject()
export default class UsersController {
  constructor(private usersService: UsersService) {}
  async getProfile(ctx: HttpContext) {
    const user = ctx.auth.user
    await user?.load('cart', (builder) =>
      builder.withCount('products', (query) => {
        query.as('totalProducts')
      })
    )

    const totalProducts = Number(user?.cart?.$extras.totalProducts)

    const profile = await this.usersService.getProfile(user!.id)

    ctx.response.send({
      ...user?.serialize(),
      cart: { ...user?.cart.serialize(), totalProducts },
      profile,
    })
  }

  async updateProfile(ctx: HttpContext<UpdateProfileDTO>) {
    const user = ctx.auth.user?.serialize()
    const newProfile = await this.usersService.updateProfile(user?.id, ctx.body)

    ctx.response.send(newProfile)
  }

  async recharge(ctx: HttpContext) {
    const user = await this.usersService.recharge(ctx.auth.user!.id, {
      money: ctx.request.body().money,
    })

    ctx.response.send(user)
  }
}
