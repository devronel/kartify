"use client"

import { Button } from "@/components/ui/button"
import { Plus} from "lucide-react"
import CategoryModalCreate from "./category-modal-create"
import { useEffect, useState } from "react"
import { CategoryTree } from "@/types/admin/category"
import apiClient from "@/lib/api-client"
import DataFetchingIndicator from "@/components/shared/data-fetching-indicator"
import ErrorFetchingIndicator from "@/components/shared/error-fetching-indicator"
import CategoryCardListTree from "./category-card-list-tree"
import CategoryModalUpdate from "./category-modal-update"

export default function CategoryList() {
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [categoryId, setCategoryId] = useState<number>();
    const [categories, setCategories] = useState<CategoryTree[]>([])
    const [isFetchingCategories, setIsFetchingCategories] = useState<boolean>(false)
    const [hasError, setHasError] = useState<string | null>(null)

    const closeCreateModal = () => {
        setIsModalOpen(prev => !prev)
    }

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(prev => !prev)
    }

    const fetchCategories = async () => {
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

    const findCategoryById = async (id: number) => {
        setCategoryId(id);
        setIsUpdateModalOpen(true)
    }

    useEffect(() => {
        fetchCategories()
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
                                <CategoryCardListTree 
                                    nodes={categories}
                                    level={0}
                                    onUpdate={findCategoryById}
                                />
                            </div>
                        ) : (
                            <ErrorFetchingIndicator 
                                title="Unable to load categories"
                                description="We couldn't retrieve the categories. Please try again."
                                onRetry={fetchCategories}
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

            {/* Create Category Modal */}
            {
                isModalOpen && (
                    <CategoryModalCreate 
                        open={isModalOpen}
                        onOpenModal={closeCreateModal}
                        onFetchCategories={fetchCategories}
                    />
                )
            }

            {/* Update Category Modal */}
            {
                isUpdateModalOpen && (
                    <CategoryModalUpdate 
                        id={categoryId}
                        open={isUpdateModalOpen}
                        onOpenModal={closeUpdateModal}
                        onFetchCategories={fetchCategories}
                    />
                )
            }
        </>
    )
}