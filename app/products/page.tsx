"use client"

import { useState } from "react";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductCard from "@/components/product/ProductCard";

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Best Selling"];

const products = [
  { id: 1, name: "Minimal Watch", price: 129.99, image: "/vercel.svg", tag: "New" },
  { id: 2, name: "Leather Backpack", price: 89.99, originalPrice: 119.99, image: "/vercel.svg" },
  { id: 3, name: "Wireless Earbuds", price: 59.99, image: "/vercel.svg", tag: "New" },
  { id: 4, name: "Running Shoes", price: 119.99, originalPrice: 149.99, image: "/vercel.svg", tag: "Sale" },
  { id: 5, name: "Cotton T-Shirt", price: 29.99, image: "/vercel.svg" },
  { id: 6, name: "Denim Jacket", price: 99.99, image: "/vercel.svg", tag: "New" },
  { id: 7, name: "Smart Speaker", price: 79.99, originalPrice: 99.99, image: "/vercel.svg" },
  { id: 8, name: "Yoga Mat", price: 34.99, image: "/vercel.svg" },
  { id: 9, name: "Ceramic Mug Set", price: 24.99, image: "/vercel.svg" },
  { id: 10, name: "Sunglasses", price: 49.99, image: "/vercel.svg", tag: "New" },
  { id: 11, name: "Desk Lamp", price: 44.99, originalPrice: 59.99, image: "/vercel.svg" },
  { id: 12, name: "Notebook", price: 14.99, image: "/vercel.svg" },
];

export default function ProductPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState("Newest");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
          <p className="mt-1 text-slate-500">Browse our full collection</p>
        </div>

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
            <p className="text-sm text-slate-500">{products.length} products</p>
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
              {products.map((product) => (
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
      </div>
    </div>
  );
}
