import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      isDeleted: false,
      quantity: faker.number.int(2000), // faker.random.number(1000, 10000
      collection_id: faker.number.int({ min: 109, max: 111 }), // Randomly select collection_id from 1 to 6
      imageUrl: '',
    }
  })
  .build()
