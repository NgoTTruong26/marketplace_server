import { Secret } from '@adonisjs/core/helpers'

export default interface IRefreshToken {
  accessToken: string | Secret<string>
}
