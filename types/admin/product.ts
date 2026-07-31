export type CategoryNode = {
  id: number
  name: string
  children?: CategoryNode[]
}

export type AttributeValue = {
  id: number
  name: string
}

export type Attribute = {
  id: number
  name: string
  values: AttributeValue[]
}

export type ProductImage = {
  id: string
  file: File
  preview: string
  isPrimary: boolean
  sortOrder: number
}

export type VariantRowData = {
  sku: string
  price: string
  stock: string
  image: { file: File; preview: string } | null
  isActive: boolean
}

export type VariantCombo = {
  key: string
  attrValueIds: number[]
  label: string
}