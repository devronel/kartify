export type CartDetails = {
  id: number,
  productId: number,
  productVariantId: number,
  imageUrl: string,
  name: string,
  price: number,
  quantity: number,
  subtotal: number
}

export type CartResponse = {
  items: CartDetails[],
  subtotal: number,
  totalQuantity: number
}

export type CartItem = {
  productId: number,
  productVariantId: number | null,
  quantity: number
}