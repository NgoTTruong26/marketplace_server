import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    description: vine.string().trim().minLength(3).maxLength(100),
    payment_method: vine.string().trim().minLength(3).maxLength(100),
    user_id: vine.number().min(1),
    total_price: vine.number().min(1),
    cart_items: vine.array(
      vine.object({
        product_id: vine.number().min(1),
        quantity: vine.number().min(1),
      })
    ),
  })
)
