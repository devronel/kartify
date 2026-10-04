"use client"

import apiClient from "@/lib/api-client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "../ui/toast";
import { CornerDownRight, Dot } from "lucide-react";
import { useRouter } from "next/navigation";


type FilterSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
}


type CategoryFilter = {
  id: number,
  name: string,
  slug: string,
  productCount: number,
  child: CategoryFilter[]
}

export default function FilterSidebar({ 
  mobileOpen, 
  onClose 
}: FilterSidebarProps) {

  const router = useRouter();
  const [categories, setCategories] = useState<CategoryFilter[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);


  //  Get all catigories
  const getCategories = async() => {
    try {
      const response = await apiClient("/api/products/filters/categories");
      setCategories(response.data)
    } catch (error: any) {
      toast.add({
          type: 'Error',
          description: "Category Fetching Error"
      })
    }
  }


  // Clear filter
  const clearFilter = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    router.push("/shop")
  }

  
  useEffect(() => {
    getCategories()
  }, [])


  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          onClick={clearFilter}
          className="text-xs cursor-pointer font-medium text-slate-500 hover:text-slate-900"
        >
          Clear all
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">Category</h4>
        <div>
          {categories.map((category) => (
            <CategoryFilterList key={category.id} {...category} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}


const CategoryFilterList = ({
  id,
  name,
  slug,
  productCount,
  child
}: CategoryFilter) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Link href={`/shop?category=${name}`} className="text-sm hover:underline">
          {name}
        </Link>
        <p className="text-sm">{productCount}</p>
      </div>
      
      {
        child.length > 0 && (
          <div className="ml-3">
            {
              child.map(category => (
                <CategoryFilterList 
                  key={category.id}
                  {...category}
                />
              ))
            }
          </div>
        )
      }
    </>
  )
}