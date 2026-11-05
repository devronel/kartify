export type CheckoutAddress = {
  id: number
  label: string
  shippingRecipientName: string
  shippingPhone: string
  shippingAddressLine1: string
  shippingAddressLine2: string
  shippingProvince: string
  shippingCity: string
  shippingBarangay: string
  shippingCountry: string
  shippingRegion: string
  shippingPostalCode: string
  isDefault: boolean
} 

export type CheckoutCartItem = {
  id: number
  productName: string
  productImage: string
  variantLabel: string
  price: number
  quantity: number
}

export type CheckoutDetailsResponse = {
  addresses: CheckoutAddress[]
  cartItems: CheckoutCartItem[]
  subtotal: number
  total: number
}