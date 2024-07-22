import Order from '#models/order'
import OrderDetail from '#models/order_detail'
import Product from '#models/product'
import User from '#models/user'

export default class OrderService {
  async createOrder(data: any) {
    const { description, payment_method, user_id, total_price, cart_items } = data

    const user = await User.findOrFail(user_id)

    const order = new Order()
    order.description = description
    order.paymentMethod = payment_method
    order.totalPrice = total_price
    order.userId = user_id
    await order.save()
    const listOrderDetail = []
    for (const cartItem of cart_items) {
      const orderDetail = new OrderDetail()
      const productId = cartItem.product_id
      const quantity = cartItem.quantity
      const product = await Product.findOrFail(productId)
      orderDetail.orderId = order.id
      orderDetail.productId = productId
      orderDetail.numberProduct = quantity
      orderDetail.price = product.price
      listOrderDetail.push(orderDetail)
    }
    await OrderDetail.createMany(listOrderDetail)
    return order
  }
  async getOrderByUserId(userId: number) {
    return Order.query().where('userId', userId).andWhere('isDeleted', false)
  }

  async getProductIsBuyed(userID: number) {
    const listOrder = await this.getOrderByUserId(userID)
    const orderIds = listOrder.map((order: any) => order.id)
    const listOrderDetail = await OrderDetail.query().whereIn('orderId', orderIds)
    const productIds = listOrderDetail.map((orderDetail: any) => orderDetail.productId)
    return Product.query().whereIn('id', productIds)
  }
}
