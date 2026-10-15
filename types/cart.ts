export type CartDetails = {
  id: number,
  productId: number,
  productVariantId: number,
  imageUrl: string,
  name: string,
  price: number,
  quantity: number,
  subtotal: number,
  availableStock: number,
  isAvailable: boolean
}

export type CartResponse = {
  items: CartDetails[],
  subtotal: number,
  totalQuantity: number,
  hasUnavailableItems: boolean
}

export type CartItem = {
  productId: number,
  productVariantId: number | null,
  quantity: number
}