export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export type PaymentStatus = "CREATING" | "PENDING" | "SUCCEEDED" | "FAILED" | "SETUP_FAILED" | "CREATION_UNKNOWN" | "EXPIRED" | "REFUNDED"

export type PaymentMethod = "GCASH" | "MAYA" | "QRPh"

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

export type PaymentSummaryResponse = {
  status: PaymentStatus,
  paymentMethod: PaymentMethod,
  checkoutUrl: string,
  paidAt: string
}

export type OrderStatusHistoryResponse = {
  status: OrderStatus
  createdAt: string
}

export type OrderDetailsResponse = {
  orderNumber: string
  status: OrderStatus
  subtotal: number
  shippingFee: number
  discountAmount: number
  total: number
  shippingRecipientName: string
  shippingPhone: string
  shippingAddressLine1: string
  shippingAddressLine2: string
  shippingBarangay: string
  shippingCity: string
  shippingProvince: string
  shippingRegion: string
  shippingPostalCode: string
  shippingCountry: string
  notes: string
  isPayable: boolean
  isExpired: boolean
  expiresAt: string
  createdAt: string,
  orderItems: OrderItem[]
  payment: PaymentSummaryResponse
  timeline: OrderStatusHistoryResponse[]
}