import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import db from '@adonisjs/lucid/services/db'
import IGoogleAuth from './types/GoogleAuth.type.js'
import IRefreshToken from './types/RefreshToken.type.js'

export default class AuthsService {
  async googleAuth(email: string): Promise<IGoogleAuth> {
    const user = await User.query().preload('profile').where({ email: email }).first()

    if (user) {
      //create token
      // eslint-disable-next-line unicorn/no-await-expression-member
      const accessToken = (await User.accessTokens.create(user)).value?.release() || ''
      const refreshToken = (await User.refreshTokens.create(user)).value?.release() || ''

      return { user, accessToken, refreshToken }
    } else {
      const data = await db.transaction(async (trx) => {
        const newUser = await User.create(
          {
            email,
          },
          { client: trx }
        )

        await newUser.related('profile').create(
          {
            username: email.split('@')[0],
          },
          { client: trx }
        )

        await newUser.related('cart').create({}, { client: trx })

        return newUser
      })

      const accessToken = (await User.accessTokens.create(data)).value?.release() || ''
      const refreshToken = (await User.refreshTokens.create(data)).value?.release() || ''

      return { user: data, accessToken, refreshToken }
    }
  }

  async refreshToken(refreshToken: string): Promise<IRefreshToken> {
    const userId = (await User.refreshTokens.verify(new Secret(refreshToken)))?.identifier
    const user = await User.findByOrFail('id', userId)
    const accessToken = (await User.accessTokens.create(user)).value?.release() || ''

    return {
      accessToken,
    }
  }
}
