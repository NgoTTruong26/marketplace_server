// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UsersService from './user.service.js'

@inject()
export default class UsersController {
  constructor(private usersService: UsersService) {}
  async getProfile(ctx: HttpContext) {
    const user = ctx.auth.user!.serialize()
    const profile = await this.usersService.getProfile(user.id)

    ctx.response.send({ ...user, profile })
  }
}
