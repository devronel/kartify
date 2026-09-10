"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { ProductAttribute, ProductAttributeValue } from "@/types/product"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import ProductAttributeSelection from "./product-attribute-selection"
import DataFetchingIndicator from "@/components/shared/data-fetching-indicator"
import ErrorFetchingIndicator from "@/components/shared/error-fetching-indicator"
import { Spinner } from "@/components/ui/spinner"
import { ValidationErrorResponse } from "@/types/api-error"
import { toast } from "@/components/ui/toast"
import { Field, FieldError } from "@/components/ui/field"


export default function ProductAttributeList(){

    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [hasError, setHasError] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([])
    const [selectedAttributeValues, setSelectedAttributeValues] = useState<ProductAttributeValue[][]>([])
    const [attribute, setAttribute] = useState<string>("")

    // Get selected attribute value
    const getSelectedAttributeValue = (attributeValue: ProductAttributeValue) => {
        setSelectedAttributeValues(prev => {

            const updated = [...prev]

            const groupIndex = updated.findIndex(
                group => group.length > 0 && group[0].productAttributeId === attributeValue.productAttributeId
            )

            if (groupIndex === -1) {
                updated.push([attributeValue])
            } else {
                updated[groupIndex] = [
                    ...updated[groupIndex],
                    attributeValue
                ]
            }

            return updated
        })
    }

    // Save new attribute
    const save = async () => {
        try {
            setIsSaving(true)
            const response = await apiClient.post('/api/admin/product/attribute', { name: attribute },{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            if(response.data.success){
                getAllProductAttributeWithValue()
                setAttribute("")
                setErrors({})
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
            setIsSaving(false)
        }
    }

    // Get all product attributes including its values
    const getAllProductAttributeWithValue = async () => {
        try {
            setIsFetchingData(true)
            const response = await apiClient('/api/admin/product/attribute')
            setProductAttributes(response.data)
        } catch (error: any) {
            setHasError(error.message)
        } finally {
            setIsFetchingData(false)
        }
    }

    useEffect(() => {
        getAllProductAttributeWithValue()
    }, [])

    return (
        <>
            {
                !isFetchingData ? (
                    !hasError ? (
                        productAttributes.map(attribute => {
                            return (
                                <ProductAttributeSelection 
                                    key={attribute.id}
                                    data={attribute}
                                    onSelectedAttributeValue={getSelectedAttributeValue}
                                />
                            )
                        })
                    ) : (
                        <ErrorFetchingIndicator 
                            title="Unable to load product attributes"
                            description="We couldn't retrieve the product attributes. Please try again."
                            onRetry={getAllProductAttributeWithValue}
                        />
                    )
                ) : (
                    <DataFetchingIndicator 
                        title="Loading product attribute data"
                        description="Please wait while we fetch the product attribute."
                    />
                )
            }
            <div className="mt-3 flex max-w-md items-center gap-2">
                <Field>
                    <Input
                        type="text"
                        placeholder="Add a new attribute (e.g. Material)..."
                        aria-invalid={errors.name ? true : false}
                        value={attribute}
                        onChange={(event) => setAttribute(event.target.value)}
                    />
                </Field>
                <Button onClick={save} disabled={isSaving} type="button" variant="outline" className="cursor-pointer">
                    {
                        isSaving ? <Spinner className="size-4" /> : <Plus className="size-4" />
                    }
                    Add Attribute
                </Button>
            </div>
        </>
    )

}