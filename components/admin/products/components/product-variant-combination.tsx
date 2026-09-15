import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cartesian } from "@/lib/helper"
import { ProductAttributeValue, ProductVariant } from "@/types/product"
import { Boxes, Layers } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type ProductVariantCombinationProps = {
    selectedAttributeValues: ProductAttributeValue[][],
    onVariantChange: (productVariant: ProductVariant[]) => void,
    variantErrors: Record<string, string>
}

export default function ProductVariantCombination({ selectedAttributeValues, onVariantChange, variantErrors } : ProductVariantCombinationProps){

    const [productVariants, setProductVariants] = useState<ProductVariant[]>([])
    const [stockQuantity, setStockQuantity] = useState<number>(0)

    // Generate variant combination
    const variants: ProductAttributeValue[][] = useMemo(() => {
        return cartesian(selectedAttributeValues)
    }, [selectedAttributeValues])

    // Handle change event in every input and save to the state
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        
        const { name, value } = event.target
        
        setProductVariants(prev =>
            prev.map((variant, idx) =>
                idx === index ? {...variant, [name]: value} : variant
            )
        )

    }

    // Checked change for switch component
    const onCheckedChange = (value: boolean, index: number) => {
        setProductVariants(prev =>
            prev.map((variant, idx) =>
                idx === index ? {...variant, isActive: value} : variant
            )
        )
    }

    // Set stock for all
    const setStockForAll = () => {
        if(stockQuantity <= 0) return
        
        setProductVariants(prev =>
            prev.map(variant => ({
                ...variant,
                stockQuantity: stockQuantity
            }))
        );

        setStockQuantity(0)
    }

    // Create state for every new variant combination and preserve if theres existing
    useEffect(() => {
        if(variants.length > 0 && variants[0].length > 0){
            setProductVariants(prev =>
                variants.map(attributeValues => {
                    const existingVariant = prev.find(prevVariant =>
                        prevVariant.attributeValues.every(value => attributeValues.some(
                                newValue => newValue.id === value.id
                            )
                        ) &&
                        attributeValues.length === prevVariant.attributeValues.length
                    )

                    return existingVariant ?? {
                        attributeValues,
                        sku: "",
                        price: "",
                        comparePrice: "",
                        costPrice: "",
                        stockQuantity: 0,
                        isActive: true
                    }
                })
            )
        }
    }, [variants])

    useEffect(() => {
        onVariantChange(productVariants)
    }, [productVariants])

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-foreground/60">
                    2
                </span>
                <h3 className="text-sm font-semibold text-sidebar-foreground">Variant Combinations</h3>
                {
                    variants.length > 0 && variants[0].length > 0 && (
                        <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-foreground/60">
                            {variants.length} generated
                        </span>
                    )
                }
                </div>
                {
                    variants.length > 0 && variants[0].length > 0 && (
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Stock"
                                title="Set stock for all variants"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(Number(e.target.value))}
                            />
                            <Button onClick={setStockForAll} type="button" variant="outline" size="sm">
                                Set stock for all
                            </Button>
                        </div>
                    )
                }
            </div>

            {
                productVariants.length > 0 ? (
                    <>
                        <p className="mb-3 text-xs text-sidebar-foreground/40">
                            Regenerating attribute selections preserves any data already entered. Blank price overrides inherit the base price.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-170">
                                <thead>
                                    <tr className="border-b border-sidebar-border text-left">
                                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Variant
                                        </th>
                                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            SKU
                                        </th>
                                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Price Override
                                        </th>
                                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Compare Price
                                        </th>
                                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Cost Price
                                        </th>
                                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Stock <span className="text-red-500">*</span>
                                        </th>
                                        {/* <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Image
                                        </th> */}
                                        <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                                            Active
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        productVariants.map((variant, index) => {
                                            const attributeValues: ProductAttributeValue[] = variant.attributeValues
                                            return (
                                                <tr key={index} className="border-b border-sidebar-border last:border-0">
                                                    <td className="px-3 py-2.5 pr-4">
                                                        <div className="flex items-center gap-1.5 text-sm font-medium text-sidebar-foreground">
                                                            <Layers className="size-3.5 shrink-0 text-sidebar-foreground/40" />
                                                            <div>
                                                                {
                                                                    attributeValues.map((value, index) => (
                                                                        <span key={value.id}>
                                                                            {value.productAttributeValueName}
                                                                            {index < attributeValues.length - 1 ? '/' : ''} 
                                                                        </span>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2.5 pr-4">
                                                        <Input
                                                            type="text"
                                                            placeholder="SKU"
                                                            name='sku'
                                                            aria-invalid={variantErrors[`variants[${index}].sku`] ? true : false}
                                                            value={variant.sku}
                                                            onChange={event => handleChange(event, index)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 pr-4">
                                                        <Input
                                                            type="number"
                                                            inputMode="decimal"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="₱ base"
                                                            name='price'
                                                            aria-invalid={variantErrors[`variants[${index}].price`] ? true : false}
                                                            value={variant.price}
                                                            onChange={event => handleChange(event, index)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 pr-4">
                                                        <Input
                                                            type="number"
                                                            inputMode="decimal"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="₱ compare price"
                                                            name='price'
                                                            aria-invalid={variantErrors[`variants[${index}].comparePrice`] ? true : false}
                                                            value={variant.comparePrice}
                                                            onChange={event => handleChange(event, index)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 pr-4">
                                                        <Input
                                                            type="number"
                                                            inputMode="decimal"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="₱ cost price"
                                                            name='price'
                                                            aria-invalid={variantErrors[`variants[${index}].costPrice`] ? true : false}
                                                            value={variant.costPrice}
                                                            onChange={event => handleChange(event, index)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 pr-4">
                                                        <Input
                                                            type="number"
                                                            inputMode="numeric"
                                                            min="0"
                                                            step="1"
                                                            placeholder="0"
                                                            name='stock'
                                                            aria-invalid={variantErrors[`variants[${index}].stockQuantity`] ? true : false}
                                                            value={variant.stockQuantity}
                                                            onChange={event => handleChange(event, index)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 text-right">
                                                        <Switch 
                                                            size="sm" 
                                                            checked={variant.isActive}
                                                            onCheckedChange={value => onCheckedChange(value, index)}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={`${variantErrors.variants ? 'border-red-500' : 'border-sidebar-border'} rounded-xl border border-dashed p-10 text-center`}>
                            <Boxes className="mx-auto size-8 text-sidebar-foreground/30" />
                            <p className="mt-3 text-sm font-medium text-sidebar-foreground">
                                No variants generated yet
                            </p>
                            <p className="mx-auto mt-1 max-w-sm text-xs text-sidebar-foreground/50">
                                Check at least one attribute and select its values above to auto-generate all size/color combinations.
                            </p>
                        </div>
                        { variantErrors.variants && (<FieldError className="mt-3">{variantErrors.variants}</FieldError>) }
                    </>
                )
            }
        </div>
    )
}