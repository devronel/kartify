export type ProductFormValues = {
    name: string,
    slug: string,
    categoryId: number | null,
    sku: string,
    shortDescription: string,
    description: string,
    price: string,
    comparePrice: string,
    costPrice: string,
    weight: number,
    hasVariant: boolean,
    stockQuantity: number,
    isActive: boolean,
    isFeatured: boolean
}

export type ProductAttribute = {
  id: number,
  name: string,
  values: ProductAttributeValue[]
}

export type ProductAttributeValue = {
  id: number,
  productAttributeId: number,
  productAttributeValueName: string
}

export type ProductImage = {
  id: string
  file: File
  preview: string
  isPrimary: boolean
  sortOrder: number
}

export type ProductVariant = {
  attributeValues: ProductAttributeValue[],
  sku: string,
  price: string,
  comparePrice: string,
  costPrice: string,
  stockQuantity: number,
  isActive: boolean
}