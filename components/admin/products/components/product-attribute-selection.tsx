"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { ValidationErrorResponse } from "@/types/api-error"
import { ProductAttribute, ProductAttributeValue } from "@/types/product"
import { ChevronDown, Plus } from "lucide-react"
import { useState } from "react"

type ProductAttributeSelectionProps = {
    data: ProductAttribute,
    onAttributeValueSelect: (attributeValues: ProductAttributeValue) => void,
    onProductAttributeUpdate: (attributeValues: ProductAttributeValue) => void
}

export default function ProductAttributeSelection({ data, onAttributeValueSelect, onProductAttributeUpdate } : ProductAttributeSelectionProps){

    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [expanded, setExpanded] = useState<boolean>(true)
    const [checked, setChecked] = useState<boolean>(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [selectedCount, setSelectedCount] = useState<number>(0)
    const [attributeValue, setAttributeValue] = useState<string>("")

    const toggleExpand = (attributeId: number) => {
        if(attributeId === data.id){
            setExpanded(prev => !prev)
        }
    }

    // Save new product attribute value
    const save = async () => {
        try {
            setIsSaving(true)
            const payload = {
                productAttributeId: data.id,
                productAttributeValueName: attributeValue 
            }
            const response = await apiClient.post("/api/admin/product/attribute/values", payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if(response.data.success){

                const attributeValue: ProductAttributeValue = response.data.payload

                onProductAttributeUpdate(attributeValue)

                setAttributeValue("")
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

    return (
        <div className="overflow-hidden rounded-lg border border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2.5">
                <button onClick={() => toggleExpand(data.id)} type="button" className="cursor-pointer flex flex-1 items-center gap-2 text-left">
                    <ChevronDown
                        className={`size-4 shrink-0 text-sidebar-foreground/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                    <span className="text-sm font-medium text-sidebar-foreground">
                        { data.name }
                    </span>
                </button>
                {
                    checked && selectedCount > 0 ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {selectedCount} selected
                        </span>
                    ) : (
                        <span className="text-xs text-sidebar-foreground/40">
                            { data.values.length } values
                        </span>
                    )
                }
            </div>

            {expanded && (
                <div className="space-y-2 border-t border-sidebar-border px-3 py-3 pl-12">
                    {
                        data.values.length > 0 && (
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                                {
                                    data.values.map(value => (
                                        <label key={value.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-2.5 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                                            <input
                                                type="checkbox"
                                                className="size-3.5 shrink-0 accent-sidebar-primary"
                                                onChange={() => onAttributeValueSelect(value)}
                                            />
                                            { value.productAttributeValueName }
                                        </label>
                                    ))
                                }
                            </div>
                        )
                    }
                    <div className="flex items-center gap-2 pt-1">
                        <Input
                            type="text"
                            placeholder={`Add a value to Color...`}
                            className="max-w-xs"
                            aria-invalid={errors.productAttributeValueName ? true : false}
                            value={attributeValue}
                            onChange={(event) => setAttributeValue(event.target.value)}
                        />
                        <Button onClick={save} disabled={isSaving} type="button" variant="outline" size="sm" className="cursor-pointer">
                            {
                                isSaving ? <Spinner className="size-4" /> : <Plus className="size-4" />
                            }
                            Add
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}