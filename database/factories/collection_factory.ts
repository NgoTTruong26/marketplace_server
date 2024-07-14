import factory from '@adonisjs/lucid/factories'
import Collection from '#models/collection'

export const CollectionFactory = factory
  .define(Collection, async ({ faker }) => {
    return {
      name: faker.lorem.words(3),
      floor_price: faker.commerce.price(),
      description: faker.lorem.sentence(),
      isDeleted: false,
      totalVolume: faker.number.int({ min: 2000, max: 10000 }),
      categoryId: faker.number.int({ min: 1, max: 6 }),
    }
  })
  .build()
