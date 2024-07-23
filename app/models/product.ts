import Collection from '#models/collection'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Cart from './cart.js'
import CartProduct from './cartProducts.js'
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

  @belongsTo(() => CartProduct)
  declare cartProduct: BelongsTo<typeof CartProduct>

  @manyToMany(() => Cart, {
    pivotTable: 'cart_products', // Tên bảng trung gian
    localKey: 'id', // Khóa chính của Product
    pivotForeignKey: 'product_id', // Khóa ngoại trong bảng trung gian đại diện cho Product
    relatedKey: 'id', // Khóa chính của Cart
    pivotRelatedForeignKey: 'cart_id', // Khóa ngoại trong bảng trung gian đại diện cho Cart
  })
  declare carts: ManyToMany<typeof Cart>
}
