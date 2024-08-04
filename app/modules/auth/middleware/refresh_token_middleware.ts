import RefreshTokenException from '#exceptions/refresh_token_exception'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RefreshTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.request.encryptedCookie(env.get('REFRESH_TOKEN'))) {
      throw new RefreshTokenException([
        {
          message: 'Session expired, please re-login',
        },
      ])
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
