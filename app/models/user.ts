import Order from '#models/order'
import Profile from '#models/profile'
import { JwtAccessTokenProvider, JwtSecret } from '#providers/jwt_access_token.provider'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import parseDuration from 'parse-duration'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare walletBalance: number

  @column()
  declare isDeleted: boolean

  @column()
  declare refreshToken: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  static accessTokens = JwtAccessTokenProvider.forModel(User, {
    expiresInMillis: parseDuration('1 day')!,
    key: new JwtSecret('BjBZ-s9JFJTBwUsOo1Ml-fzkCqja_byX'),
    primaryKey: 'id',
    algorithm: 'HS256',
    audience: 'http://localhost:5173',
    issuer: 'http://localhost:3333',
  })
}
