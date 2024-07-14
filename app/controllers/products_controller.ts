import InvalidImageException from '#exceptions/invalid_image_exception'
import HttpStatusCode from '#responses/HttpStatusCode'
import CloudinaryService from '#services/CloudinaryService'
import ProductService from '#services/product_service'
import { validateParams } from '#validators/category'
import ImageValidator from '#validators/image'
import { createProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'

@inject()
export default class ProductsController {
  constructor(
    private productService: ProductService,
    private imageValidator: ImageValidator
  ) {}

  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    try {
      const { page, limit } = ctx.pagination
      console.log(page, limit)
      const listProducts = await this.productService.getAllProducts(ctx.pagination)

      ctx.response.status(HttpStatusCode.OK).send({
        message: 'List of products',
        page: listProducts.currentPage,
        perPage: listProducts.all().length,
        product: listProducts.all(),
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Product not found',
      })
    }
  }

  /**
   * Display form to create a new record
   */
  async store(ctx: HttpContext) {
    try {
      const data = await createProductValidator.validate(ctx.request.all())
      const productImage = ctx.request.file('image')

      if (!productImage || productImage.tmpPath === undefined || productImage.tmpPath === null) {
        throw new InvalidImageException()
      }
      console.log(productImage.size)

      if (
        !this.imageValidator.checkImageType(productImage) ||
        !this.imageValidator.checkImageSize(productImage)
      ) {
        throw new InvalidImageException()
      }

      const resultImage = await CloudinaryService.upload(productImage.tmpPath)
      const image_url = resultImage.url
      this.productService.createProduct({ ...data, image_url })

      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Product created successfully',
        data: data,
      })
    } catch (error) {
      if (error instanceof InvalidImageException) {
        error.handle(error, ctx)
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Could not create product',
          errors: error.messages,
        })
      }
    }
  }

  /**
   * Show individual record
   */
  async show(ctx: HttpContext) {
    try {
      const id = await validateParams.validate(ctx.params.id)

      const product = await this.productService.getProductById(id)

      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Successful',
        data: product,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'GET PRODUCT FAILED',
          error: 'product not found',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'GET PRODUCT FAILED',
        })
      }
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update(ctx: HttpContext) {
    const id = await validateParams.validate(ctx.params.id)
    // const data = await createProductValidator.validate(ctx.request.all())
    const data = ctx.request.all()
    try {
      const product = await this.productService.updateProduct(id, data)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Product updated successfully',
        data: product,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE PRODUCT FAILED',
          error: 'Product not found',
        })
      } else {
        console.log(error)
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE PRODUCT FAILED',
          error: error.messages,
        })
      }
    }
  }

  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    try {
      const id = await validateParams.validate(ctx.params.id)
      await this.productService.deleteProduct(id)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Product deleted successfully',
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'DELETE PRODUCT FAILED',
          error: 'Product not found',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'DELETE PRODUCT FAILED',
          error: error.messages,
        })
      }
    }
  }

  async uploadProductImage(ctx: HttpContext) {
    try {
      const productImage = ctx.request.file('image')

      if (!productImage || productImage.tmpPath === undefined || productImage.tmpPath === null) {
        throw new InvalidImageException()
      }

      if (!this.imageValidator.checkImageType(productImage)) {
        throw new InvalidImageException()
      }

      const resultImage = await CloudinaryService.upload(productImage.tmpPath)
      const image_url = resultImage.url

      const updatedProduct = await this.productService.updateProduct(ctx.params.id, { image_url })
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Product image uploaded successfully',
        data: updatedProduct,
      })
    } catch (error) {
      if (error instanceof InvalidImageException) {
        error.handle(error, ctx)
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Could not upload image',
        })
      }
    }
  }
}
