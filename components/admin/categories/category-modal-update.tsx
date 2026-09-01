"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Category, CategoryFormValues } from "@/types/admin/category"
import { Check } from "lucide-react"
import React, { useEffect, useState } from "react"
import SelectCategory from "./category-select"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { toast } from "@/components/ui/toast"
import { ValidationErrorResponse } from "@/types/api-error"
import { Spinner } from "@/components/ui/spinner"
import DataFetchingIndicator from "@/components/shared/data-fetching-indicator"
import ErrorFetchingIndicator from "@/components/shared/error-fetching-indicator"


type CategoryModalUpdateProps = {
    id?: number,
    open: boolean,
    onOpenModal: () => void,
    onFetchCategories: () => Promise<void>
}

export default function CategoryModalUpdate({ id, open, onOpenModal, onFetchCategories } : CategoryModalUpdateProps ) {

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasError, setHasError] = useState<string | null>(null)
    const [isFetchingCategory, setIsFecthingCategory] = useState<boolean>(false)
    const [category, setCategory] = useState<CategoryFormValues>({
        name: '',
        parentId: null,
        description: '',
        isActive: true
    })
    const [categorySelectValue, setCategorySelectValue] = useState<Category>();

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setCategory(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const selectedCategories = (category: Category) => {
        if(category){
            setCategory(prev => ({
                ...prev,
                parentId: category.id
            }))
        }
    }

    // --- Save updated category ---
    const save = async () => {
        try {
            setIsButtonLoading(true)
            const response = await apiClient.put(`/api/product/category/${id}`, category, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if(response.data.success){
                onFetchCategories()
                setErrors({})
                onOpenModal()
            }

        } catch (error: any) {
            if (isAxiosError<ValidationErrorResponse>(error) && error.response?.status === 422) {
                setErrors(error.response.data.errors)
                return
            }

            toast.add({
                type: 'Error',
                description: "Something went wrong."
            })
        } finally {
            setIsButtonLoading(false)
        }
    }

    // --- Find Category by id for Edit ---
    const findCategory = async () => {
        try {
            setIsFecthingCategory(true)
            const response = await apiClient(`/api/product/category/${id}`)
            if(response.data.success){
                setHasError(null)
                const payload = response.data.payload
                setCategory(prev => {
                    return {
                        ...prev,
                        id: payload.id,
                        name: payload.name,
                        description: payload.description,
                        isActive: payload.isActive 
                    }
                })

                if(payload.parent){
                    setCategorySelectValue({
                        id: payload.parent.id,
                        name: payload.parent.name,
                        isActive: payload.parent.isActive
                    })
                }
            }
        } catch (error: any) {
            setHasError(error.message)
        } finally {
            setIsFecthingCategory(false)
        }
    }

    useEffect(() => {
        findCategory()
    }, [])

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Update Category - {id}
                        </DialogTitle>
                        <DialogDescription className="mt-0.5 text-sm text-sidebar-foreground/60">
                            Update category and nest it under a parent if needed
                        </DialogDescription>
                    </DialogHeader>

                    {
                        !isFetchingCategory ? (
                            !hasError ? (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="CategoryName">
                                            Name
                                            <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="CategoryName"
                                            name="name"
                                            type="text"
                                            aria-invalid={errors.name ? true : false}
                                            value={category.name}
                                            onChange={handleOnChange}
                                            placeholder="e.g. Shirts"
                                        />
                                        { errors.name && (<FieldError>{errors.name}</FieldError>) }
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="parentCategory">
                                            Parent Category<span className="italic font-light">(optional)</span>
                                        </FieldLabel>
                                        <SelectCategory 
                                            onSelected={selectedCategories}
                                            value={categorySelectValue}
                                        />
                                        { errors.parentId && (<FieldError>{errors.parentId}</FieldError>) }
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="description">Description</FieldLabel>
                                        <Textarea 
                                            id="description"
                                            name="description"
                                            value={category.description}
                                            onChange={handleOnChange}
                                        />
                                    </Field>

                                    <Field>
                                        <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-4 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-sidebar-foreground">Active</p>
                                                <p className="text-xs text-sidebar-foreground/50">
                                                Inactive categories are hidden from customers
                                                </p>
                                            </div>
                                            <Switch 
                                                checked={category.isActive}
                                                onCheckedChange={value => setCategory(prev => ({ ...prev, isActive: value }))}
                                            />
                                        </div>
                                    </Field>

                                    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sidebar-border py-3">
                                        <Button onClick={ onOpenModal} disabled={isButtonLoading} type="button" variant="outline" className='cursor-pointer'>
                                            Cancel
                                        </Button>
                                        <Button onClick={save} disabled={isButtonLoading} type="button" className='cursor-pointer'>
                                            {
                                                isButtonLoading ? <Spinner className="size-4" /> : <Check className="size-4" />
                                            }
                                            Save
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <ErrorFetchingIndicator 
                                    title="Unable to load categorys"
                                    description="We couldn't retrieve the category. Please try again."
                                    onRetry={findCategory}
                                />
                            )
                        ) : (
                            <DataFetchingIndicator 
                                title="Loading category data"
                                description="Please wait while we fetch the category."
                            />
                        )
                    }

                </DialogContent>
            </Dialog>
        </>
    )
}