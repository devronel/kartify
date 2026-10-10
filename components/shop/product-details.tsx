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
import { DatabaseCheck, LayersMinus, MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

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

  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);
  const [isCartButtonDisable, setIsCartButtonDisabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [currentStockQuantity, setCurrentStockQuantity] = useState<number>(stockQuantity)
  const [selectVariantAttribute, setSelectedVariantAttribute] = useState<Record<string, number>>({})
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
  const addToCart = async() => {
    try {
      
      setIsButtonLoading(true)

      await apiClient.post("/api/cart", cartItem)

      toast.add({
        type: "success",
        description: `Product Added to Cart Successfully.`,
      })

    } catch (error: unknown) {
      
      let description = "Failed to add product to cart.";

      if (isAxiosError(error)) {
        description = error.response?.data?.message ?? description;
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
      
      setCurrentStockQuantity(stockQuantityCount)
    
    }

  }, [selectVariantAttribute])


  // Disable & Enable Cart Button
  useEffect(() => {
    if(currentStockQuantity > 0){
      setIsCartButtonDisabled(false)
    }else{
      setIsCartButtonDisabled(true)
    }
  }, [currentStockQuantity])

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-slate-900">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-10">
          <div>
            <SwiperWrapper
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
              } as React.CSSProperties}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Thumbs]}
              className="mySwiper2"
            >
              {
                images.map((image, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img src={image} alt={`Image of ${name}`} />
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
                    <SwiperSlide>
                      <img src={image} alt={`Image of ${name}`} />
                    </SwiperSlide>
                  )
                })
              }
            </SwiperWrapper>
          </div>

          <div className="flex flex-col">

            <h1 className="text-3xl font-bold text-slate-900">{name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-slate-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-slate-900">&#8369;{moneyFormat.format(price)}</p>
            </div>

            <div className="mb-6">
              <p className="mt-6 text-slate-600 leading-relaxed">{shortDescription}</p>
            </div>

            <div className="flex flex-col gap-7">
              {/* Variant attribute */}
              <div className="flex flex-col gap-7">
                {
                  variantAttributes.map(attribute => {
                    return (
                      <div key={attribute.id} className="grid grid-cols-[100px_1fr]">
                          <p className="text-sm">{attribute.name}</p>
                          <div className="flex items-center gap-3">
                            {
                              attribute.values.map(attributeValue => {
                                return (
                                  <div key={attributeValue.id}>
                                    <input
                                      type="radio"
                                      name={attribute.name}
                                      checked={selectVariantAttribute[attribute.name] === attributeValue.id}
                                      value={attributeValue.id}
                                      onChange={handleSelectedVariant}
                                      id={attributeValue.productAttributeValueName}
                                      className="peer sr-only"
                                    />
                                    <label
                                      htmlFor={attributeValue.productAttributeValueName}
                                      className="
                                        inline-flex cursor-pointer items-center rounded border px-3 py-1
                                        text-sm font-medium
                                        transition-colors
                                        peer-checked:text-primary
                                        peer-checked:border-primary
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
              {/* Variant attribute */}

              {/* Quantity */}
              <div className="flex flex-col gap-3">
                <p className={`text-sm flex items-center gap-1 ${ currentStockQuantity > 0 ? 'text-primary' : 'text-red-400'}`}>
                  { currentStockQuantity > 0 ? <DatabaseCheck className="size-4" /> : <LayersMinus className="size-4" /> }
                  { currentStockQuantity > 0 ? "In Stock" : "Out of Stock" }
                </p>
                {
                  currentStockQuantity > 0 && (
                    <p className="text-sm">Only <span className="font-bold">{currentStockQuantity}</span> left in stock</p>
                  )
                }
                <div className="grid grid-cols-[100px_1fr]">
                  <p className="text-sm">Quantity</p>
                  <ButtonGroup
                    orientation="horizontal"
                    aria-label="Media controls"
                    className="h-fit"
                  >
                    <Button onClick={decrementQuantity} disabled={cartItem.quantity <= 1} variant="outline" size="sm">
                      <MinusIcon />
                    </Button>
                    <Input 
                      disabled
                      value={cartItem.quantity} 
                      onChange={(event) => getQuantity(Number(event.target.value))} 
                      type="number" 
                      className="text-center text-sm w-12 h-8"
                    />
                    <Button onClick={incrementQuantity} disabled={cartItem.quantity >= currentStockQuantity} variant="outline" size="sm">
                      <PlusIcon />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              {/* Quantity */}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={addToCart} 
                size={'lg'} 
                disabled={isCartButtonDisable || isButtonLoading} 
                className={`w-full`}
              >
                { isButtonLoading ? <Spinner data-icon="inline-start" /> : <ShoppingCart className=" align-top" /> }
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t py-4">
          <h1 className="font-bold text-2xl mb-2">Description</h1>
          <p>{description}</p>
        </div>
      </div>
    </>
  )
}