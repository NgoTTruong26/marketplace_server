import Cart from '#models/cart'
import CartProduct from '#models/cartProducts'
import db from '@adonisjs/lucid/services/db'
import { AddProductToCartDto } from './dto/add_product_to_cart.dto.js'
import { GetCartDto } from './dto/get_cart.dto.js'
import { RemoveProductFromCartDto } from './dto/remove_product_from_cart.dto.js'

export default class CartService {
  async addProductToCart(userId: number, data: AddProductToCartDto) {
    const cart = await Cart.findByOrFail('user_id', userId)

    const productExists = await db
      .query()
      .from('cart_products')
      .where({
        cart_id: cart.id,
        product_id: data.productId,
      })
      .first()

    if (productExists) {
      throw new Error('Product already exists in cart')
    }

    await db.table('cart_products').insert({
      cart_id: cart.id,
      product_id: data.productId,
    })

    return cart
  }

  async removeProductFromCart({ cartId, productId }: RemoveProductFromCartDto) {
    console.log(cartId, productId)

    const cartProduct = await CartProduct.query()
      .where({
        cartId,
        productId,
      })
      .delete()

    return cartProduct
  }

  async getCart(data: GetCartDto) {
    const cart = await Cart.findByOrFail('user_id', data.userId)

    await cart.load('products')

    return cart
  }
}
