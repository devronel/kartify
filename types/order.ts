export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export type OrderResponse = {
  canPay: boolean
  expireAt: string
  itemCount: number
  orderNumber: string
  paymentStatus: string
  status: OrderStatus
  total: number
  orderItems: OrderItem[]
}

export type OrderItem = {
  id: number
  productName: string
  variantLabel: string
  productImage: string
  price: number
  quantity: number
  lineTotal: number
}