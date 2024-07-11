import User from '#models/user'
import IGoogleAuth from './types/GoogleAuth.type.js'

export default class GoogleAuthsService {
  async googleAuth(email: string): Promise<IGoogleAuth> {
    const user = await User.query().preload('profile').where({ email: email }).first()

    if (user) {
      //create token
      const accessToken = (await User.accessTokens.create(user)).value?.release() || ''

      return { user, accessToken: accessToken }
    } else {
      const newUser = await User.create({
        email,
      })

      await newUser.related('profile').create({
        username: email.split('@')[0],
      })

      const accessToken = (await User.accessTokens.create(newUser)).value?.release() || ''

      return { user: newUser, accessToken }
    }
  }
}
