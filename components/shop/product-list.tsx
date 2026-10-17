"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, PackageSearch, SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./filter-sidebar";
import ProductCard, { ProductCardSkeleton } from "./product-card";
import apiClient from "@/lib/api-client";
import { Paginate } from "@/types/paginate";
import CustomPagination from "../shared/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "../ui/toast";
import { Button, buttonVariants } from "../ui/button";

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

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [products, setProducts] = useState<Paginate<PublicProduct> | null>(null);


  // Get all products
  const getProducts = async() => {
    try {

      const params = new URLSearchParams({ 
        page: String(page),
        pageSize: "12" 
      });

      if(q){
        params.set("q", q);
      }

      if(category) {
        params.set("category", category)
      }

      const response = await apiClient(`/api/products?${params}`);

      setProducts(response.data)

    } catch (error: any) {
      toast.add({
          type: 'Error',
          description: "Something went wrong."
      })
    }
  }


  // Get all products
  useEffect(() => {
    getProducts()
  }, [page, q, category])


  // Reset the page to 1 if the input is greater than the actual page
  useEffect(() => {
    if (products && products.totalPages > 0 && page > products.totalPages) {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");

      router.replace(`?${params.toString()}`);
    }
  }, [products, page, searchParams, router]);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(true)}
            className="cursor-pointer lg:hidden"
          >
            <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
            Filters
          </Button>

          <p className="text-sm text-muted-foreground">
            {products
              ? `${products.payload.length} ${products.payload.length === 1 ? "product" : "products"}`
              : "Loading products…"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-muted-foreground">
            Sort by
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 cursor-pointer appearance-none rounded-md border bg-background pl-3 pr-9 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <FilterSidebar mobileOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />

        <div className="min-w-0 flex-1">
          {/* Loading state */}
          {!products && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {products && products.payload.length === 0 && (
            <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <PackageSearch className="size-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try a different search or clear your filters to see everything.
              </p>
              <Link href="/shop" className={buttonVariants({ className: "mt-4" })}>
                Clear filters
              </Link>
            </div>
          )}

          {/* Error state — TODO(logic): track a fetch error and switch to <ErrorFetchingIndicator /> here */}
          {/*<ErrorFetchingIndicator title="Couldn't load products" description="..." onRetry={getProducts} />*/}

          {/* Product grid */}
          {products && products.payload.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
                {products.payload.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {products.totalItems > products.pageSize && (
                <div className="mt-6">
                  <CustomPagination 
                    currentPage={page}
                    totalPages={products.totalPages}
                    visiblePages={3}
                    hasPrevious={products.hasPrevious}
                    hasNext={products.hasNext}
                    searchParams={searchParams.toString()}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
