import Product from '#models/product'

export default class ProductService {
  async getAllProducts(data: any) {
    const { page, limit, keyword, sort } = data
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
      .where('isDeleted', false)
      .andWhere((builder) => {
        builder.where('name', 'like', `%${keyword}%`).orWhere('description', 'like', `%${keyword}%`)
      })
      .orderBy('price', 'asc')
      .paginate(page, limit)
  }

  async getProductById(id: number) {
    return Product.query().where('id', id).andWhere('isDeleted', false).firstOrFail()
  }

  async createProduct(data: any) {
    return Product.create(data)
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
