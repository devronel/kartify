"use client"

import DataFetchingIndicator from "@/components/shared/data-fetching-indicator"
import ErrorFetchingIndicator from "@/components/shared/error-fetching-indicator"
import CustomPagination from "@/components/shared/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import apiClient from "@/lib/api-client"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Product = {
    id: number,
    category: string,
    name: string,
    sku: string,
    price: number,
    comparePrice: number,
    costPrice: number,
    hasVariants: boolean,
    stockQuantity: number,
    weight: number,
    isActive: boolean,
    isFeatured: boolean,
    primaryImage: string
}

type Paginate<T> = {
    payload: T[],
    currentPage: number,
    hasNext: boolean,
    hasPrevious: boolean,
    pageSize: number,
    totalItems: number,
    totalPages: number
}

const statusStyles: Record<string, string> = {
  true: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  false: "bg-slate-500/10 text-slate-600 border-slate-500/20"
};

export default function ProductList(){

    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [products, setProducts] = useState<Paginate<Product> | null>(null)
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
    const [hasError, setHasError] = useState<string | null>(null)

    const getProducts = async () => {
        try {
            setIsFetchingData(true)
            setHasError(null)
            const response = await apiClient(`/api/admin/product?page=${currentPage}`)
            setProducts(response.data)
        } catch (error: any) {
            setHasError(error.message)
        } finally {
            setIsFetchingData(false)
        }
    }

    useEffect(() => {
        getProducts()
    }, [currentPage])

    return (
        <>
            <div className="rounded-xl border border-sidebar-border bg-sidebar overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-sidebar-border">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
                        <input
                            type="text"
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
                    <Table>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                !isFetchingData ? (
                                    !hasError ? (
                                        products?.payload.map(product => {
                                            return (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                                                                {
                                                                    <img src={product.primaryImage} alt="" width={24} height={24} className="object-contain" />
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-sidebar-foreground">{product.name}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{product.category}</TableCell>
                                                    <TableCell>&#8369;{product.price}</TableCell>
                                                    <TableCell>
                                                        <span className={`text-sm ${product.stockQuantity === 0 ? "text-red-500" : "text-sidebar-foreground/70"}`}>
                                                            {product.stockQuantity === 0 ? "Out of stock" : product.stockQuantity}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.isActive.toString()]}`}>
                                                            {product.isActive ? "Active" : "InActive"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <button
                                                            className="rounded-lg p-2 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <ErrorFetchingIndicator 
                                                    title="Unable to load products"
                                                    description="We couldn't retrieve the product. Please try again."
                                                    onRetry={getProducts}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <DataFetchingIndicator 
                                                title="Loading products"
                                                description="Please wait while we fetch all the products."
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
            {
                products ? (
                    <div className="mt-3">
                        <CustomPagination 
                            currentPage={currentPage}
                            totalPages={products?.totalPages ?? 0}
                            visiblePages={3}
                            hasPrevious={products.hasPrevious}
                            hasNext={products.hasNext}
                        />
                    </div>
                ) : null
            }
        </>
    )
}