import Order from '#models/order'
import Profile from '#models/profile'
import { JwtAccessTokenProvider, JwtSecret } from '#providers/jwt_access_token.provider'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import parseDuration from 'parse-duration'
import Collection from '#models/collection'
import env from '#start/env'

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

  @hasMany(() => Collection)
  declare collections: HasMany<typeof Collection>

  static accessTokens = JwtAccessTokenProvider.forModel(User, {
    expiresInMillis: parseDuration('1 day')!,
    key: new JwtSecret(env.get('SECRET_KEY')),
    primaryKey: 'id',
    algorithm: 'HS256',
    audience: 'http://localhost:5173',
    issuer: 'http://localhost:3333',
  })
}
