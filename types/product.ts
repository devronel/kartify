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
}

export type ProductImage = {
  id: string
  file: File
  preview: string
  isPrimary: boolean
  sortOrder: number
}