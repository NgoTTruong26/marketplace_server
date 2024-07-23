import CartProduct from '#models/cartProducts'
import Collection from '#models/collection'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'
import { GetProductListFromCartDto } from './dto/get_product_list_from_cart.dto.js'

export default class ProductService {
  async getAllProducts(data: any) {
    const { page, limit, keyword, sort, collectionId } = data
    console.log(sort)
    if (sort === '-price') {
      return await Product.query()
        .where('isDeleted', false)
        .andWhere((builder) => {
          builder
            .where('name', 'like', `%${keyword}%`)
            .orWhere('description', 'like', `%${keyword}%`)
        })
        .orderBy('price', 'desc')
        .paginate(page, limit)
    }
    return await Product.query()
      .where('collectionId', collectionId)
      .andWhere('isDeleted', false)
      .andWhere((builder) => {
        builder.where('name', 'like', `%${keyword}%`).orWhere('description', 'like', `%${keyword}%`)
      })
      .orderBy('id', 'asc')
      .paginate(page, limit)
  }

  async getProductsFromCart(data: GetProductListFromCartDto) {
    const { cartId } = data

    const cartProduct = await CartProduct.query()
      .where({
        cartId: cartId,
      })
      .preload('product', (builder) => builder.preload('collection'))
      .orderBy('createdAt', 'desc')

    return cartProduct
  }

  async getProductById(id: number) {
    const product = await Product.query()
      .where('id', id)
      .andWhere('isDeleted', false)
      .preload('collection', (builder) => builder.preload('profile').preload('category'))
      .firstOrFail()

    const productList = await Product.query()
      .where('collectionId', product.collectionId)
      .andWhere('isDeleted', false)
      .orderBy('id', 'asc')
      .limit(10)
    return { ...product.serialize(), productList }
  }

  async createProduct(data: any) {
    return await db.transaction(async (trx) => {
      const product = await Product.create(data, { client: trx })

      const collection = await Collection.findByOrFail('id', product.collectionId, { client: trx })

      if (collection.floorPrice === 0 || collection.floorPrice > product.price) {
        collection.floorPrice = product.price
      }
      collection.totalVolume += product.price

      await collection.save()

      await product.load('collection')

      return product
    })
  }

  async deleteProduct(id: number) {
    const product = await Product.query().where('id', id).andWhere('isDeleted', false).firstOrFail()

    product.isDeleted = true

    await product.save()
  }

  async updateProduct(id: number, data: any) {
    const product = await Product.query().where('id', id).andWhere('isDeleted', false).firstOrFail()
    product.merge(data)
    await product.save()
    return product
  }
}
