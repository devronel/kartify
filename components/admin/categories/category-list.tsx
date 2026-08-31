"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, FolderIcon, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react"
import CategoryModalCreate from "./category-modal-create"
import React, { useEffect, useState } from "react"
import { CategoryTree } from "@/types/admin/category"
import apiClient from "@/lib/api-client"
import DataFetchingIndicator from "@/components/shared/data-fetching-indicator"
import ErrorFetchingIndicator from "@/components/shared/error-fetching-indicator"

export default function CategoryList() {
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoryTree[]>([])
    const [isFetchingCategories, setIsFetchingCategories] = useState<boolean>(false)
    const [hasError, setHasError] = useState<string | null>(null)

    const closeCreateModal = () => {
        setIsModalOpen(prev => !prev)
    }

    const getCategories = async () => {
        try {
            setIsFetchingCategories(true)
            const response = await apiClient('/api/product/category')
            setCategories(response.data)
        } catch (error: any) {
            setHasError(error.message)
        } finally {
            setIsFetchingCategories(false)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <>
            <div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-sidebar-foreground">Categories</h1>
                        <p className="mt-1 text-sm text-sidebar-foreground/60">
                            Organize your catalog with nested categories
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                        <Plus className="size-4" />
                        Add Category
                    </Button>
                </div>

                {
                    !isFetchingCategories ? (
                        !hasError ? (
                            <div className="overflow-hidden rounded-xl border border-sidebar-border bg-sidebar">
                                <CategoryCardList 
                                    nodes={categories}
                                    level={0}
                                />
                            </div>
                        ) : (
                            <ErrorFetchingIndicator 
                                title="Unable to load categories"
                                description="We couldn't retrieve the categories. Please try again."
                                onRetry={getCategories}
                            />
    
                        )
                    ) : (
                        <DataFetchingIndicator 
                            title="Loading categories"
                            description="Please wait while we fetch the categories."
                        />
                    )
                }

            </div>

            {
                isModalOpen && (
                    <CategoryModalCreate 
                        open={isModalOpen}
                        onOpenModal={closeCreateModal}
                        onFetchCategories={getCategories}
                    />
                )
            }
        </>
    )
}

type CategoryCardListProps = {
    nodes: CategoryTree[],
    level: number
}

const CategoryCardList = ({ nodes, level = 0 } : CategoryCardListProps) => {

    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            console.log(next)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }

            return next
        })
    }

    return (
        <>
            {nodes.map(category => {
                const isExpanded = expandedIds.has(category.id)
                const hasChildren = category.children.length > 0

                return (
                    <React.Fragment key={category.id}>
                        <div
                            className="group flex items-center gap-2.5 border-b border-sidebar-border px-4 py-2.5 transition-colors last:border-0 hover:bg-sidebar-accent/50"
                            style={{ paddingLeft: `${16 + level * 16}px` }}
                        >
                            {
                                hasChildren ? (
                                    <button
                                        onClick={() => toggleExpand(category.id)}
                                        type="button"
                                        className="flex w-5 shrink-0 items-center justify-center rounded transition-colors"
                                    >
                                        <ChevronRight
                                            className={`size-4 transition-transform ${ isExpanded ? "rotate-90" : "" }`}
                                        />
                                    </button>
                                ) : (
                                    <div className="w-5 shrink-0" />
                                )
                            }

                            {
                                isExpanded ? <FolderOpen className="size-4 shrink-0 text-sidebar-foreground/40" /> : <FolderIcon className="size-4 shrink-0 text-sidebar-foreground/40" />
                            }

                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 truncate text-sm font-medium text-sidebar-foreground">
                                    {category.name}

                                    {!category.isActive && (
                                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                                            Inactive
                                        </span>
                                    )}
                                </p>

                                <p className="truncate text-xs text-sidebar-foreground/40">
                                    /{category.slug}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                    category.productCount > 0
                                        ? "bg-sidebar-accent text-sidebar-foreground/70"
                                        : "text-sidebar-foreground/40"
                                }`}
                            >
                                {category.productCount} { category.productCount > 0 ? 'products' : 'product' }
                            </span>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    className="rounded-lg p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    title="Edit category"
                                >
                                    <Pencil className="size-4" />
                                </button>

                                <button
                                    type="button"
                                    className="rounded-lg p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-red-500/10 hover:text-red-500"
                                    title="Delete category"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Render children only when expanded */}
                        {hasChildren && isExpanded && (
                            <CategoryCardList
                                nodes={category.children}
                                level={level + 1}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </>
    )
}