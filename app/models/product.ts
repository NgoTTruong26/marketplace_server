import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Collection from '#models/collection'
import OrderDetail from './order_detail.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare isDeleted: boolean

  @column()
  declare quantity: number

  @column()
  declare imageUrl: string

  @column()
  declare collectionId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Collection)
  declare collection: BelongsTo<typeof Collection>

  @hasMany(() => OrderDetail)
  declare orderDetails: HasMany<typeof OrderDetail>
}
