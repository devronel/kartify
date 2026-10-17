"use client"

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { moneyFormat } from "@/lib/helper";
import { ProductAttribute } from "@/types/product";
import { Swiper as SwiperWrapper, SwiperSlide } from 'swiper/react';
// Import swiper module
import { FreeMode, Thumbs } from 'swiper/modules';
import { Swiper } from "swiper/types";
import { Button } from "../ui/button";
import { DatabaseCheck, LayersMinus, MinusIcon, PlusIcon, ShoppingCart, Star } from "lucide-react";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation'; 
import 'swiper/css/thumbs';

import '@/app/swiper.css'
import { CartItem } from "@/types/cart";
import apiClient, { isAxiosError } from "@/lib/api-client";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import { ValidationErrorResponse } from "@/types/api-error";
import { FieldError } from "../ui/field";
import LoginModal from "../auth/login/modal";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

type PublicProductVariant = {
  id: number,
  attributeValueIds: number[],
  sku: string,
  price: string,
  inStock: boolean,
  stockQuantity: number
}

type ProductDetailProps = {
  id: number,
  name: string,
  slug: string,
  description: string,
  shortDescription: string,
  price: number,
  comparePrice: number,
  hasVariant: boolean,
  inStock: boolean,
  stockQuantity: number,
  images: string[],
  variants: PublicProductVariant[],
  variantAttributes: ProductAttribute[]
}

const product: Product = {
  id: "minimal-watch",
  name: "Minimal Watch",
  price: 129.99,
  originalPrice: 169.99,
  description:
    "A sleek and modern timepiece designed for everyday wear. Crafted with a stainless steel case, genuine leather strap, and scratch-resistant sapphire crystal glass. Water-resistant up to 30 meters.",
  images: ["/vercel.svg", "/vercel.svg", "/vercel.svg", "/vercel.svg"],
  colors: ["#000000", "#8B4513", "#C0C0C0"],
  sizes: ["One Size"],
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
};

export default function ProductDetail({ 
  id,
  name,
  slug,
  description,
  shortDescription,
  price,
  comparePrice,
  hasVariant,
  stockQuantity,
  images,
  variants,
  variantAttributes
}: ProductDetailProps){

  const { setCartCount } = useCart()
  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCartButtonDisable, setIsCartButtonDisabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [currentStockQuantity, setCurrentStockQuantity] = useState<number>(stockQuantity)
  const [selectVariantAttribute, setSelectedVariantAttribute] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cartItem, setCartItem] = useState<CartItem>({
    productId: id,
    productVariantId: null,
    quantity: 1
  });


  // Generate map for variants
  const variantMap = useMemo(() => {
    const map = new Map<string, PublicProductVariant>();

    variants.forEach(variant => {
      map.set(JSON.stringify(variant.attributeValueIds), { ...variant })
    })

    return map;
  }, []);


  // Handle selected variant
  const handleSelectedVariant = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSelectedVariantAttribute(prev => {
      return { ...prev, [name]: Number(value) }
    })
  }


  const getQuantity = (value: number) => {
    if(value <= 0) return
    setCartItem(prev => ({ ...prev, quantity: value }))
  }


  const incrementQuantity = () => {
    setCartItem(prev => ({ ...prev, quantity: prev.quantity + 1 }))
  }


  const decrementQuantity = () => {
    if(cartItem.quantity <= 1) return 
    setCartItem(prev => ({ ...prev, quantity: prev.quantity - 1 }))
  }


  // Send product to cart
  const addToCart = async () => {
    try {
      
      setIsButtonLoading(true)

      await apiClient.post("/api/cart", cartItem)

      // Reset the error
      setErrors({})

      setCartCount(prev => prev + cartItem.quantity)

      toast.add({
        type: "success",
        description: `Product Added to Cart Successfully.`,
      })

    } catch (error: unknown) {
      
      let description = "Failed to add product to cart.";

      if (isAxiosError(error)) {

        const errorResponse = error.response?.data as ValidationErrorResponse
        
        switch (error.status) {
          case 403:
            setIsLoginModalOpen(true)
            return
          case 422:
            setErrors(errorResponse.errors)
            return
          default:
            description = errorResponse.message ?? description;
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


  // 
  useEffect(() => {

    const selectedVariantIds = Object.values(selectVariantAttribute).sort()
    
    if(variantMap.has(JSON.stringify(selectedVariantIds))){
      
      const variant = variantMap.get(JSON.stringify(selectedVariantIds))
      
      const stockQuantityCount = variant?.stockQuantity ?? 0;

      setCartItem(prev => {

        if(!variant) return prev

        return { ...prev, productVariantId: variant?.id }

      })
      
      setCurrentStockQuantity(stockQuantityCount)
    
    }

  }, [selectVariantAttribute])


  // Disable & Enable Cart Button
  useEffect(() => {

    const noStock = currentStockQuantity <= 0
    const variantNotSelected = (hasVariant && !(Object.values(selectVariantAttribute).length > 0))

    setIsCartButtonDisabled(noStock || variantNotSelected)

  }, [currentStockQuantity])

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground sm:mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="transition-colors hover:text-foreground">Shop</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground" aria-current="page">{name}</li>
          </ol>
        </nav>

        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div>
            <SwiperWrapper
              style={{
                '--swiper-navigation-color': 'var(--foreground)',
                '--swiper-pagination-color': 'var(--foreground)',
              } as React.CSSProperties}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Thumbs]}
              className="mySwiper2 overflow-hidden rounded-xl border bg-muted"
            >
              {
                images.map((image, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${name} — image ${index + 1} of ${images.length}`}
                        className="object-contain!"
                      />
                    </SwiperSlide>
                  )
                })
              }
            </SwiperWrapper>
            <SwiperWrapper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs]}
              className="product-details-swiper"
            >
              {
                images.map((image, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${name} thumbnail ${index + 1}`}
                        className="rounded-lg object-cover!"
                      />
                    </SwiperSlide>
                  )
                })
              }
            </SwiperWrapper>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{name}</h1>

            {/* Rating */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                &#8369;{moneyFormat.format(price)}
              </p>
              {comparePrice > 0 && comparePrice > price ? (
                <>
                  <p className="text-base text-muted-foreground line-through">
                    &#8369;{moneyFormat.format(comparePrice)}
                  </p>
                  <Badge>Sale</Badge>
                </>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{shortDescription}</p>

            <div className="mt-6 flex flex-col gap-6">
              {/* Variant attributes */}
              {variantAttributes.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {
                    variantAttributes.map(attribute => {
                      return (
                        <div key={attribute.id} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                          <p className="text-sm font-medium text-foreground sm:w-28 sm:shrink-0 sm:pt-1.5">
                            {attribute.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {
                              attribute.values.map(attributeValue => {
                                const optionId = `variant-${attribute.id}-${attributeValue.id}`
                                return (
                                  <div key={attributeValue.id}>
                                    <input
                                      type="radio"
                                      name={attribute.name}
                                      checked={selectVariantAttribute[attribute.name] === attributeValue.id}
                                      value={attributeValue.id}
                                      onChange={handleSelectedVariant}
                                      id={optionId}
                                      className="peer sr-only"
                                    />
                                    <label
                                      htmlFor={optionId}
                                      className="
                                        inline-flex cursor-pointer items-center rounded-md border px-3 py-1.5
                                        text-sm font-medium transition-colors
                                        hover:bg-muted
                                        peer-checked:border-primary
                                        peer-checked:bg-primary/5
                                        peer-checked:text-primary
                                        peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50
                                      "
                                    >
                                      {attributeValue.productAttributeValueName}
                                    </label>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ) : null}
              { errors.productVariantId && <FieldError>{errors.productVariantId}</FieldError> }

              {/* Stock + quantity */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {currentStockQuantity > 0 ? (
                    <Badge variant="secondary" className="gap-1 text-primary">
                      <DatabaseCheck className="size-3.5" aria-hidden="true" />
                      In stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <LayersMinus className="size-3.5" aria-hidden="true" />
                      Out of stock
                    </Badge>
                  )}
                  {currentStockQuantity > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Only <span className="font-medium text-foreground">{currentStockQuantity}</span> left
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <p className="text-sm font-medium text-foreground sm:w-28 sm:shrink-0">Quantity</p>
                  <ButtonGroup
                    orientation="horizontal"
                    aria-label="Quantity"
                    className="h-fit"
                  >
                    <Button
                      onClick={decrementQuantity}
                      disabled={cartItem.quantity <= 1}
                      variant="outline"
                      size="sm"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </Button>
                    <Input 
                      disabled
                      value={cartItem.quantity} 
                      onChange={(event) => getQuantity(Number(event.target.value))} 
                      type="number" 
                      aria-label="Quantity"
                      className="h-8 w-12 text-center text-sm"
                    />
                    <Button
                      onClick={incrementQuantity}
                      disabled={cartItem.quantity >= currentStockQuantity || isCartButtonDisable}
                      variant="outline"
                      size="sm"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex flex-col gap-2">
              <Button 
                onClick={addToCart} 
                size={'lg'} 
                disabled={isCartButtonDisable || isButtonLoading} 
                className="w-full"
              >
                { isButtonLoading ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <ShoppingCart data-icon="inline-start" aria-hidden="true" />
                ) }
                Add to cart
              </Button>
              {isCartButtonDisable && !isButtonLoading ? (
                <p className="text-center text-xs text-muted-foreground">
                  {currentStockQuantity <= 0
                    ? "This item is out of stock."
                    : "Select an option to continue."}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t pt-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <LoginModal 
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}