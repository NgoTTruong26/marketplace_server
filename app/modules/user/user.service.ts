import Profile from '#models/profile'

export default class UsersService {
  async getProfile(userId: number) {
    const profile = await Profile.findByOrFail('user_id', userId)

    return profile
  }
}
