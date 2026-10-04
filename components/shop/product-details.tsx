"use client"

import { useState } from "react";
import Link from "next/link";
import { moneyFormat } from "@/lib/helper";
import { ProductAttribute } from "@/types/product";
import { Swiper as SwiperWrapper, SwiperSlide } from 'swiper/react';
// Import swiper module
import { FreeMode, Thumbs } from 'swiper/modules';
import { Swiper } from "swiper/types";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation'; 
import 'swiper/css/thumbs';

import '@/app/swiper.css'

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
  inStock: boolean
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
  images,
  variants,
  variantAttributes
}: ProductDetailProps){

  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <SwiperWrapper
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
              }}
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

            {/* <div className="flex items-center gap-2 mb-3">
              {product.originalPrice && (
                <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                  Sale
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                In Stock
              </span>
            </div> */}

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
                          <p>{attribute.name}</p>
                          <div className="flex items-center gap-3">
                            {
                              attribute.values.map(attributeValue => {
                                return (
                                  <div key={attributeValue.id}>
                                    <input
                                      type="radio"
                                      name={attribute.name}
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
              <div className="grid grid-cols-[100px_1fr]">
                <p>Quantity</p>
                <ButtonGroup
                  orientation="horizontal"
                  aria-label="Media controls"
                  className="h-fit"
                >
                  <Button variant="outline" size="sm">
                    <MinusIcon />
                  </Button>
                  <Input type="number" className="text-center w-24 h-8" />
                  <Button variant="outline" size="sm">
                    <PlusIcon />
                  </Button>
                </ButtonGroup>
              </div>
              {/* Quantity */}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 rounded bg-slate-900 py-3 px-6 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 transition-colors">
                Add to Cart
              </button>
              <button className="rounded border border-slate-300 py-3 px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 space-y-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.15-.484 1.15-1.098v-1.5c0-.614-.529-1.098-1.15-1.098H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ),
                  text: "Free shipping on orders over $50",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  ),
                  text: "30-day easy returns",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                  text: "2-year warranty included",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-slate-400">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}