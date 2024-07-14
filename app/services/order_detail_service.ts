import Order from '#models/order'
import OrderDetail from '#models/order_detail'
import Product from '#models/product'

export default class OrderDetailService {
  async createOrderDetail(data: any) {
    const { order_id, product_id, price, number_product } = data

    const order = await Order.findOrFail(order_id)
    console.log(order)
    const product = await Product.findOrFail(product_id)
    const orderDetail = new OrderDetail()
    orderDetail.orderId = order.id
    orderDetail.productId = product.id
    orderDetail.price = price
    orderDetail.numberProduct = number_product
    await orderDetail.save()
    return orderDetail
  }

  async getAlllOrderDetails() {
    return OrderDetail.all()
  }

  async upDateOrderDetail(id: number, data: any) {
    const orderDetail = await OrderDetail.findOrFail(id)
    orderDetail.merge(data)
    await orderDetail.save()
    return orderDetail
  }
}
