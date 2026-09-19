import ProductList from "@/components/admin/products/product-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin - Product List"
};

export default function ProductsListPage(){
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-sidebar-foreground">Products</h1>
                    <p className="text-sm text-sidebar-foreground/60 mt-1">
                        Manage your product catalog
                    </p>
                </div>
                <Button nativeButton={false} render={<Link href="/admin/products/create" />}>
                    <Plus className="w-4 h-4" />
                    Add New Product
                </Button>
            </div>

            {/* Product List */}
            <ProductList />
        </div>
    )
}