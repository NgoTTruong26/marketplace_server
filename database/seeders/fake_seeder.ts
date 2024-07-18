import { CollectionFactory } from '#database/factories/collection_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    //await ProductFactory.createMany(200)
    await CollectionFactory.createMany(100)
  }
}
