"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import DataFetchingIndicator from "@/components/shared/data-fetching-indicator"
import ErrorFetchingIndicator from "@/components/shared/error-fetching-indicator"
import CustomPagination from "@/components/shared/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, MoreHorizontalIcon, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Paginate } from "@/types/paginate"
import { Product } from "@/types/product"
import useDebounce from "@/hooks/use-debounce"

const statusStyles: Record<string, string> = {
  true: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  false: "bg-slate-500/10 text-slate-600 border-slate-500/20"
};

export default function ProductList(){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;
    const currentSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState<string>(currentSearch);
    const searchQuery = useDebounce(search, 800);

    const [products, setProducts] = useState<Paginate<Product> | null>(null);
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
    const [hasError, setHasError] = useState<string | null>(null);

    // Search product
    const searchProduct = (q: string) => {
        setSearch(q);
    };

    // Get all products
    const getProducts = async () => {
        try {
            setIsFetchingData(true);
            setHasError(null);

            const params = new URLSearchParams(searchParams.toString());
            const response = await apiClient(`/api/admin/product?${params.toString()}`);

            setProducts(response.data);
        } catch (error: any) {
            setHasError(error.message);
        } finally {
            setIsFetchingData(false);
        }
    };

    // Update URL when search changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("page");

        if (searchQuery.trim()) {
            params.set("search", searchQuery);
        } else {
            params.delete("search");
        }

        router.replace(`?${params.toString()}`);
    }, [searchQuery]);

    // Get products when URL changes
    useEffect(() => {
        getProducts();
    }, [searchParams]);

    return (
        <>
            <div className="rounded-xl border border-sidebar-border bg-sidebar">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-sidebar-border">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-9 pr-4 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors"
                            value={search}
                            onChange={(event) => searchProduct(event.target.value)}
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
                                                    <TableCell className="relative">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger render={
                                                                <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
                                                                    <MoreHorizontalIcon />
                                                                    <span className="sr-only">Open menu</span>
                                                                </Button>
                                                            } />
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem variant="destructive" className="cursor-pointer">
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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
                products && (
                    products.totalItems > products.pageSize && (
                        <div className="mt-3">
                            <CustomPagination 
                                currentPage={currentPage}
                                totalPages={products?.totalPages ?? 0}
                                visiblePages={3}
                                hasPrevious={products.hasPrevious}
                                hasNext={products.hasNext}
                                urlPath="products"
                            />
                        </div>
                    )
                )
            }
        </>
    )
}