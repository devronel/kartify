import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { useState } from "react";
import apiClient from "@/lib/api-client";
import { toast } from "../ui/toast";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";
import LoginModal from "../auth/login/modal";
import { useCart } from "@/context/CartContext";

type PublicProductProps = {
  id: number,
  category: string,
  name: string,
  slug: string,
  description: string,
  shortDescription: string,
  price: number
  comparePrice: number,
  hasVariant: boolean,
  primaryImage: string
}


const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


export default function ProductCard({ 
  id,
  category,
  name,
  slug,
  description,
  shortDescription,
  price,
  comparePrice,
  hasVariant,
  primaryImage
}: PublicProductProps) {

  const router = useRouter()
  const { setCartCount } = useCart();
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  // Add to Cart
  const addToCart = async () => {

    if(hasVariant){
      router.push(`/shop/${slug}`)
      return
    }
    
    try {
      
      setIsButtonLoading(true)

      await apiClient.post("/api/cart", {
        productId: id,
        productVariantId: null,
        quantity: 1
      })

      toast.add({
        type: "success",
        description: `Product Added to Cart Successfully.`,
      })

      setCartCount(prev => prev + 1)

    } catch (error: unknown) {
      
      let description = "Failed to add product to cart.";

      if (isAxiosError(error)) {
        
        switch (error.status) {
          case 403:
            setOpenLoginModal(true)
            return
          default:
            description = error.response?.data?.message ?? description;
            break;
        }

      }

      toast.add({
        type: "error",
        description,
        priority: "high",
      });

    } finally {
      setIsButtonLoading(false)
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      {/* Image */}
      <Link
        href={`/shop/${slug}`}
        aria-label={`View ${name}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={primaryImage}
          alt={name}
          className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs text-muted-foreground">{category}</p>

        <h3 className="truncate text-sm font-medium text-foreground">
          <Link href={`/shop/${slug}`} className="hover:underline">
            {name}
          </Link>
        </h3>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {shortDescription}
        </p>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-semibold text-foreground">
              &#8369;{formatter.format(price)}
            </p>
            {comparePrice && (
              <p className="text-xs text-muted-foreground line-through">
                &#8369;{formatter.format(comparePrice)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <Button
            onClick={addToCart}
            disabled={isButtonLoading}
            className="flex-1 cursor-pointer gap-2"
          >
            {isButtonLoading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <ShoppingCart data-icon="inline-start" aria-hidden="true" />
            )}
            Add to cart
          </Button>
          <Link
            href={`/shop/${slug}`}
            aria-label={`View details for ${name}`}
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />
    </article>
  );
}


// Loading skeleton — mirrors the real card so nothing jumps when data arrives.
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-2 h-9 w-full" />
      </div>
    </div>
  )
}
