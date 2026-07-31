import ProductCreateForm from "@/components/admin/products/ProductCreateForm";
import { Attribute, CategoryNode } from "@/types/admin/product";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories: CategoryNode[] = [
  {
    id: 1,
    name: "Clothing",
    children: [
      {
        id: 2,
        name: "Men",
        children: [
          { id: 3, name: "Shirts" },
          { id: 4, name: "Pants" },
        ],
      },
      {
        id: 5,
        name: "Women",
        children: [
          { id: 6, name: "Dresses" },
          { id: 7, name: "Skirts" },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Footwear",
    children: [
      { id: 9, name: "Sneakers" },
      { id: 10, name: "Boots" },
    ],
  },
  {
    id: 11,
    name: "Accessories",
    children: [
      { id: 12, name: "Bags" },
      { id: 13, name: "Watches" },
    ],
  },
]

const existingProductAttibutes: Attribute[] = [
  {
    id: 1,
    name: "Size",
    values: [
      { id: 11, name: "Small" },
      { id: 12, name: "Medium" },
      { id: 13, name: "Large" },
    ],
  },
  {
    id: 2,
    name: "Color",
    values: [
      { id: 21, name: "Red" },
      { id: 22, name: "Black" },
      { id: 23, name: "White" },
    ],
  },
]

export default function ProductCreatePage(){
  return (
    <div className="pb-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">Add New Product</h1>
          <p className="mt-1 text-sm text-sidebar-foreground/60">
            Create a new product with images and variants
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Link>
      </div>

      <ProductCreateForm categories={categories} existingProductAttibutes={existingProductAttibutes} />

    </div>
  )
}