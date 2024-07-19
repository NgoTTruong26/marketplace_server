import Collection from '#models/collection'
import db from '@adonisjs/lucid/services/db'

export default class CollectionsService {
  async createCollection(data: any) {
    return Collection.create(data)
  }

  async getAllCollections(data: any) {
    const { page, keyword, limit } = data
    return await Collection.query()
      .where('isDeleted', false)
      .andWhere((builder) => {
        builder.where('name', 'like', `%${keyword}%`).orWhere('description', 'like', `%${keyword}%`)
      })
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
}
