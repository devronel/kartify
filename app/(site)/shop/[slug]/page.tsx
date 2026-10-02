import ProductDetail from "@/components/shop/product-details";
import { apiServer } from "@/lib/api-server";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;

  try {

    const response = await apiServer(`/api/products/${slug}`)
  
    return (
      <div className="min-h-screen bg-white">
        <ProductDetail 
          {...response.data}
        />    
      </div>
    );
    
  } catch (error) {
    notFound();
  }

}
