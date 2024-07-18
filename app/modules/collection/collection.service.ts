import Collection from '#models/collection'
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
    return await Collection.query()
      .where('isDeleted', false)
      .andWhere((builder) => {
        builder.where('name', 'like', `%${keyword}%`).orWhere('description', 'like', `%${keyword}%`)
      })
      .orderBy('id', 'asc')
      .paginate(page, limit)
  }

  async getCollectionById(id: number) {
    return Collection.query().where('id', id).andWhere('isDeleted', false).firstOrFail()
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
}
