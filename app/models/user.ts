import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import Order from '#models/order'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

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
}
