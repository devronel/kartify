import ProductFormCreate from "@/components/admin/products/product-form-create";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin - Create Product"
};

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

      <ProductFormCreate />

    </div>
  )
}