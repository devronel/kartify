"use client"

import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown, MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const products = [
  { id: "#PRD-001", name: "Minimal Watch", category: "Fashion", price: 129.99, stock: 45, status: "Active" as const, image: "/vercel.svg" },
  { id: "#PRD-002", name: "Leather Backpack", category: "Fashion", price: 89.99, stock: 120, status: "Active" as const, image: "/vercel.svg" },
  { id: "#PRD-003", name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 0, status: "Draft" as const, image: "/vercel.svg" },
  { id: "#PRD-004", name: "Running Shoes", category: "Sports", price: 119.99, stock: 32, status: "Active" as const, image: "/vercel.svg" },
  { id: "#PRD-005", name: "Cotton T-Shirt", category: "Fashion", price: 29.99, stock: 200, status: "Active" as const, image: "/vercel.svg" },
  { id: "#PRD-006", name: "Denim Jacket", category: "Fashion", price: 99.99, stock: 18, status: "Archived" as const, image: "/vercel.svg" },
  { id: "#PRD-007", name: "Smart Speaker", category: "Electronics", price: 79.99, stock: 7, status: "Active" as const, image: "/vercel.svg" },
  { id: "#PRD-008", name: "Yoga Mat", category: "Sports", price: 34.99, stock: 64, status: "Active" as const, image: "/vercel.svg" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Draft: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  Archived: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">Products</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/products/create" />}>
            <Plus className="w-4 h-4" />
            Add New Product
        </Button>
      </div>

      <div className="rounded-xl border border-sidebar-border bg-sidebar overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-sidebar-border">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-9 pr-4 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors">
              Category
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors">
              Status
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sidebar-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((product) => (
                  <tr key={product.id} className="border-b border-sidebar-border last:border-0 hover:bg-sidebar-accent/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                          <Image src={product.image} alt="" width={24} height={24} className="object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-sidebar-foreground">{product.name}</p>
                          <p className="text-xs text-sidebar-foreground/40">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-sidebar-foreground/70">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm font-medium text-sidebar-foreground">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-sm ${product.stock === 0 ? "text-red-500" : "text-sidebar-foreground/70"}`}>
                        {product.stock === 0 ? "Out of stock" : product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id)}
                        className="rounded-lg p-2 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === product.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-4 top-full mt-1 z-50 w-44 rounded-xl border border-sidebar-border bg-sidebar p-1 shadow-lg">
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <div className="my-1 border-t border-sidebar-border" />
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-sidebar-border">
          <p className="text-sm text-sidebar-foreground/50">
            Showing {products.length} products
          </p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/40 cursor-not-allowed">Previous</button>
            <button className="rounded-lg bg-sidebar-accent px-3 py-1.5 text-sm font-medium text-sidebar-foreground">1</button>
            <button className="rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors">2</button>
            <button className="rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors">3</button>
            <button className="rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
