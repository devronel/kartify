import { Category } from "./admin/category"


export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const MAX_IMAGE_SIZE_MB = 5

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

export type Product = {
    id: number,
    category: string,
    name: string,
    sku: string,
    price: number,
    comparePrice: number,
    costPrice: number,
    hasVariants: boolean,
    stockQuantity: number,
    weight: number,
    isActive: boolean,
    isFeatured: boolean,
    primaryImage: string
}


// Product Update
export type ProductUpdateFormValues = {
  name: string,
  slug: string,
  category: Category,
  sku: string,
  shortDescription: string,
  description: string,
  price: string,
  comparePrice: string,
  costPrice: string,
  weight: number,
  hasVariant: boolean,
  stockQuantity: number,
  files: ProductUpdateFileValues[] | [],
  variants: ProductUpdateVariantValues[] | []
}

export type ProductUpdateFileValues = {
  uniqueId: string,
  id?: number | null,
  isPrimary: boolean,
  sortOrder: number
  preview?: string,
  file?: File,
}

export type ProductUpdateVariantValues = {
  id: number,
  attributeValueIds: number[],
  sku: string,
  price: string,
  comparePrice: string,
  costPrice: string,
  stockQuantity: number,
  weight: number,
  isActive: boolean
}