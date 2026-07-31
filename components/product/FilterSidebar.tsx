"use client"

import { useState } from "react";

const categories = [
  { label: "Electronics", count: 124 },
  { label: "Fashion", count: 89 },
  { label: "Home & Living", count: 67 },
  { label: "Sports", count: 45 },
  { label: "Beauty", count: 38 },
  { label: "Books", count: 52 },
];

const colors = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Yellow", value: "#eab308" },
];

const sizes = ["XS", "S", "M", "L", "XL"];

interface FilterSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ mobileOpen, onClose }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedColors([]);
            setSelectedSizes([]);
            setPriceRange([0, 500]);
          }}
          className="text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          Clear all
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.label)}
                onChange={() => setSelectedCategories(toggleArrayItem(selectedCategories, cat.label))}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
              <span className="text-sm text-slate-600 flex-1">{cat.label}</span>
              <span className="text-xs text-slate-400">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-slate-900"
          />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
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
