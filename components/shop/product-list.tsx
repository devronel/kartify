"use client"

import { useEffect, useState } from "react";
import FilterSidebar from "./filter-sidebar";
import ProductCard from "./product-card";
import apiClient from "@/lib/api-client";
import { Paginate } from "@/types/paginate";

type PublicProduct = {
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

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Best Selling"];

export default function ProductList(){

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [products, setProducts] = useState<Paginate<PublicProduct> | null>(null);

  const getProducts = async() => {
    try {
      const response = await apiClient(`/api/products`);
      setProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>
          <p className="text-sm text-slate-500">{products?.payload.length} products</p>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-8">
        <FilterSidebar mobileOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />

        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products?.payload.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-1">
              <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    page === 1
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}