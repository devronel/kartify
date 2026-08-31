"use client"

import React, { useEffect, useRef, useState } from "react"
import apiClient from "@/lib/api-client"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Category, CategoryTree, CategoryTreeNodeProps } from "@/types/admin/category"
import { AlertCircleIcon, ChevronDown, ChevronUp, FolderTree } from "lucide-react"

type SelectCategoryProps = {
    onSelected: (category: Category) => void
    value?: Category 
}

export default function SelectCategory({ onSelected, value } : SelectCategoryProps) {

    const dropdownRef = useRef<HTMLDivElement>(null)
    const [categories, setCategories] = useState<CategoryTree[]>([])
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [hasError, setHasError] = useState<string | null>(null)

    const getCategories = async () => {
        try {
            setIsFetching(true)
            const response = await apiClient('/api/product/category')
            setCategories(response.data)
            setIsFetching(false)
        } catch (error: any) {
            setIsFetching(false)
            setHasError("Something wen't wrong.")
        }
    }

    const onSelectedCategory = (category: Category) => {
        if(category){
            setOpenDialog(false)
            setSelectedCategory(category)
            onSelected(category)
        }
    }

    
    useEffect(() => {
        if(openDialog && categories.length <= 0){
            getCategories()
        }
    }, [openDialog])


    useEffect(() => {
        if(value){
            setSelectedCategory(value)
            onSelected(value)
        }
    }, [])


    // --- Handle the click outside of dropdown ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDialog(false);
            }
        };

        if (openDialog) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDialog]);

    return (
        <>
            <div className="relative">
                <Button onClick={() => setOpenDialog(prev => !prev)} type="button" variant="outline" className="w-full flex items-center justify-between">
                    { selectedCategory ? selectedCategory.name : 'Select Category' }
                    { openDialog ? <ChevronUp /> : <ChevronDown /> }
                </Button>
                {
                    openDialog && (
                        <div ref={dropdownRef} className="absolute left-0 right-0 top-10 z-10 h-auto max-h-50 overflow-y-auto flex rounded-lg border border-sidebar-border bg-white">
                            <ul className="w-full flex flex-col gap-1">
                                {
                                    !isFetching ? (
                                        !hasError ? (
                                            categories.length > 0 ? (
                                                <CategoryTreeNode
                                                    nodes={categories}
                                                    level={0}
                                                    onSelected={onSelectedCategory}
                                                    value={selectedCategory}
                                                />
                                            ) : (
                                                <Alert className="max-w-md">
                                                    <AlertCircleIcon />
                                                    <AlertTitle>No Category Available.</AlertTitle>
                                                </Alert>
                                            )
                                        ) : (
                                            <Alert variant="destructive" className="max-w-md">
                                                <AlertCircleIcon />
                                                <AlertTitle>{hasError}</AlertTitle>
                                            </Alert>
                                        )
                                    ) : (
                                        <li className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                                            <Spinner className="size-4" />
                                            Fetching Categories...
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        </>
    )
}


// --- Category Tree Node Component ---
const CategoryTreeNode = ({ nodes, level = 0, onSelected, value } : CategoryTreeNodeProps ) => {
    return (
        <>
            {
                nodes.map(node => {
                    return (
                        <React.Fragment key={node.id}>
                            <li>
                                <button
                                    onClick={() => onSelected(node)}
                                    type="button"
                                    className={`${value?.id === node.id ? 'bg-sidebar-accent' : ''} cursor-pointer flex w-full items-center gap-2 px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors`}
                                    style={{ paddingLeft: `${8 + level * 16}px` }}
                                >
                                    <FolderTree className="size-4 shrink-0 text-sidebar-foreground/40" />
                                    <span className="truncate">{node.name}</span>
                                </button>
                            </li>

                            {
                                node.children.length > 0 && (
                                    <CategoryTreeNode
                                        nodes={node.children}
                                        level={level + 1}
                                        onSelected={onSelected}
                                        value={value}
                                    />
                                )
                            }
                        </React.Fragment>
                    )
                })
            }
        </>
    )
}