import ProductFormUpdate from "@/components/admin/products/product-form-update";
import { apiServer } from "@/lib/api-server";
import { uid } from "@/lib/helper";
import { ProductUpdateFileValues, ProductUpdateFormValues } from "@/types/product";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductUpdatePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductUpdatePage({ params }: ProductUpdatePageProps){

    const { id } = await params;

    if (!id || id.trim() === '') {
        notFound();
    }

    try {

        const response = await apiServer(`/api/admin/product/${id}`);
        
        const payloadResponse = response.data.payload
        
        const payload: ProductUpdateFormValues = {
            name: payloadResponse.name,
            slug: payloadResponse.slug,
            category: payloadResponse.category,
            sku: payloadResponse.sku,
            shortDescription: payloadResponse.shortDescription,
            description: payloadResponse.description,
            price: payloadResponse.price,
            comparePrice: payloadResponse.comparePrice,
            costPrice: payloadResponse.costPrice,
            weight: payloadResponse.weight,
            hasVariant: payloadResponse.hasVariant,
            stockQuantity: payloadResponse.stockQuantity,
            files: payloadResponse.files.map((file: any) => ({
                id: file.id,
                uniqueId: uid(),
                preview: file.fileUrl,
                isPrimary: file.isPrimary,
            })),
            variants: payloadResponse.variants
        }

        console.log(payload)

        return (
            <div className="pb-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-sidebar-foreground">Update Product</h1>
                        <p className="mt-1 text-sm text-sidebar-foreground/60">
                            Update product with images and variants
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
    
                <ProductFormUpdate 
                    product={payload}
                />
    
          </div>
        )
        
    } catch (error) {

        notFound();

    }

}