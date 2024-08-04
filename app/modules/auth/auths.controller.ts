import env from '#start/env'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { OAuth2Client } from 'google-auth-library'
import AuthsService from './auth.service.js'
import { GoogleAuthsDto } from './dto/google_auth.dto.js'

@inject()
export default class AuthsController {
  private oAuth2Client: OAuth2Client

  constructor(private authsService: AuthsService) {
    this.oAuth2Client = new OAuth2Client(
      env.get('GOOGLE_CLIENT_ID'),
      env.get('GOOGLE_CLIENT_SECRET'),
      'postmessage'
    )
  }

  async googleAuth(ctx: HttpContext) {
    const { code } = ctx.request.body() as GoogleAuthsDto

    const {
      tokens: { access_token },
    } = await this.oAuth2Client.getToken(code)

    if (!access_token) {
      throw new Error('Bad request')
    }

    const { email } = await this.oAuth2Client.getTokenInfo(access_token)

    if (!email) {
      throw new Error('Bad request')
    }

    const { refreshToken, ...data } = await this.authsService.googleAuth(email)

    return ctx.response
      .encryptedCookie(env.get('REFRESH_TOKEN'), refreshToken, {
        httpOnly: false,
      })
      .send(data)
  }

  async refreshToken(ctx: HttpContext) {
    const data = await this.authsService.refreshToken(
      ctx.request.encryptedCookie(env.get('REFRESH_TOKEN'))
    )
    return ctx.response.send(data)
  }
}
