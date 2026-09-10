export type ProductFormValues = {
    name: string,
    slug: string,
    categoryId: number | null,
    sku: string,
    shortDescription: string,
    description: string,
    basePrice: number,
    comparePrice: number,
    costPrice: number,
    weight: number,
    weightUnit: 'kg' | 'g',
    hasVariant: boolean,
    stockQuantity: number
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