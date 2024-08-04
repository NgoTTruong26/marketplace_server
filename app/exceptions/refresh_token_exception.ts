import HttpStatusCode from '#responses/HttpStatusCode'
import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class RefreshTokenException extends Exception {
  static status = HttpStatusCode.FORBIDDEN
  static messages?: any[] | undefined = []
  constructor(messages?: any[]) {
    super()
    RefreshTokenException.messages = messages
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.clearCookie(env.get('REFRESH_TOKEN')).status(error.status).send({
      messages: RefreshTokenException.messages,
    })
  }
}
