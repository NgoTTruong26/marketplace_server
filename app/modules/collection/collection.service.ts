import Collection from '#models/collection'
import db from '@adonisjs/lucid/services/db'
import { Pagination } from '../../types/pagination.js'

export default class CollectionsService {
  async createCollection(data: any) {
    return Collection.create(data)
  }

  async getTopCollections(data: Pagination) {
    return await Collection.query()
      .preload('profile')
      .orderBy('totalVolume', 'desc')
      .limit(data.limit)
  }

  async getAllCollections(data: any) {
    const { page, keyword, limit } = data
    const result = await Collection.query()
      .where('isDeleted', false)
      .andWhere((builder) => {
        builder.where('name', 'like', `%${keyword}%`)
      })
      .withCount('products', (query) => {
        query.as('totalProducts')
      })
      .orderBy('totalVolume', 'desc')
      .paginate(page, limit)

    const collections = result.toJSON()

    collections.data = collections.data.map((collection) => {
      const totalProducts = Number(collection.$extras.totalProducts)
      return { ...collection.serialize(), totalProducts }
    })

    return collections
  }

  async getCollectionById(id: number) {
    const collection = await Collection.query()
      .where('id', id)
      .andWhere('isDeleted', false)
      .preload('profile')
      .withCount('products', (query) => {
        query.as('totalProducts')
      })
      .firstOrFail()

    const totalProducts = Number(collection.$extras.totalProducts)

    return {
      ...collection.serialize(),
      totalProducts,
    }
  }

  async deleteCollection(id: number) {
    const collection = await Collection.query()
      .where('id', id)
      .andWhere('isDeleted', false)
      .firstOrFail()

    collection.isDeleted = true

    await collection.save()
  }

  async updateCollection(id: number, data: any) {
    const collection = await Collection.query()
      .where('id', id)
      .andWhere('isDeleted', false)
      .firstOrFail()
    collection.merge(data)
    await collection.save()
    return collection
  }
  async getUser(collectionId: number) {
    const result = await db.rawQuery(
      'SELECT DISTINCT p.* FROM users u join collections c on u.id = c.created_by_user_id join profiles p on u.id = p.user_id where c.id = ?',
      [collectionId]
    )
    return result.rows
  }

  async getCollectionByUserId(userId: number) {
    const result = await db.rawQuery(
      'SELECT * FROM collections WHERE created_by_user_id = ? AND is_deleted = false',
      [userId]
    )

    return result.rows
  }

  async deleteCollectionByUser(userId: number, collectionId: number) {
    const collection = await Collection.query()
      .where('id', collectionId)
      .andWhere('created_by_user_id', userId)
      .andWhere('isDeleted', false)
      .firstOrFail()

    collection.isDeleted = true
    await collection.save()

    const products = await collection.related('products').query().where('isDeleted', false)
    for (const product of products) {
      product.isDeleted = true
      await product.save()
    }
  }
}
