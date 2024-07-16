import Profile from '#models/profile'
import { UpdateProfileDTO } from './dto/update_profile.dto.js'

export default class UsersService {
  async getProfile(userId: number) {
    const profile = await Profile.findByOrFail('user_id', userId)

    return profile
  }

  async updateProfile(userId: number, data: UpdateProfileDTO) {
    console.log('User Id', userId)

    console.log('Updating profile', data)
  }
}
