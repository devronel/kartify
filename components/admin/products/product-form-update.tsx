"use client"

import { useState } from "react"
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB, ProductUpdateFileValues, ProductUpdateFormValues } from "@/types/product"
import SectionCard from "../shared/SectionCard"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { slugify, slugifyFinal, uid } from "@/lib/helper"
import { GripVertical, Lock, Pencil, PhilippinePeso, RefreshCw, Send, Star, Trash2, UploadCloud } from "lucide-react"
import SelectCategory from "../categories/category-select"
import { Category } from "@/types/admin/category"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

type ProductFormUpdateProps = {
    product: ProductUpdateFormValues
}

export default function ProductFormUpdate({ product }: ProductFormUpdateProps){

    const [dragOver, setDragOver] = useState<boolean>(false)
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [imagesError, setImagesError] = useState<string | null>(null)
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const [slugEditing, setSlugEditing] = useState<boolean>(false)
    const [formData, setFormData] = useState<ProductUpdateFormValues>({
        name: product.name,
        slug: product.slug,
        category: product.category,
        sku: product.sku ?? "",
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        price: product.price,
        comparePrice: product.comparePrice ?? "",
        costPrice: product.costPrice ?? "",
        weight: product.weight,
        hasVariant: product.hasVariant,
        stockQuantity: product.stockQuantity,
        files: product.files,
        variants: product.variants
    })


    // Selected Category
    const selectedCategories = (category: Category) => {
        if(category){
            setFormData(prev => ({
                ...prev,
                category: category
            }))
        }
    }


    // Handles input and textarea changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData(prev => {

            const updatedData = {
                ...prev,
                [name]: value
            };
        
            if (name === 'name' && !slugEditing) {
                updatedData.slug = slugify(value);
            }
    
            if (name === 'slug' && slugEditing) {
                updatedData.slug = slugify(value); 
            }
    
            return updatedData;

        })
    };


    // Get slug on blur input
    const handleSlugBlur = () => {
        setFormData(prev => ({
            ...prev,
            slug: slugifyFinal(prev.slug)
        }));
    };


    // Regenerate slug from name
    const regenerateSlug = () => {
        setFormData(prev => ({
            ...prev,
            slug: slugify(formData.name)
        }));
    }


    // Add files
    const addImageFiles = (files: FileList | File[]) => {
        const list = Array.from(files)
        const valid = list.filter((imageType) => ACCEPTED_IMAGE_TYPES.includes(imageType.type))
        const rejected = list.length - valid.length
        const oversized = valid.filter((imageSize) => imageSize.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
        const acceptedFile = valid.filter((imageSize) => imageSize.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024)
    
        const messages: string[] = []
        if (rejected > 0) messages.push(`Skipped ${rejected} file(s). Only JPG, PNG, or WEBP images are allowed.`)
        if (oversized.length > 0) messages.push(`Skipped ${oversized.length} file(s) larger than ${MAX_IMAGE_SIZE_MB}MB.`)
        setImagesError(messages.join(" "))
    
        if (acceptedFile.length === 0) return
    
        setFormData(prev => {

            const files = [...prev.files]

            const added = acceptedFile.map<ProductUpdateFileValues>((file) => ({
                id: null,
                uniqueId: uid(),
                file,
                preview: URL.createObjectURL(file),
                isPrimary: false,
                sortOrder: files.length,
            }))

            if (added.length > 0 && !files.some((image) => image.isPrimary)) {
                added[0].isPrimary = true
            }

            const updated = [...files, ...added].map((image, index) => ({ ...image, sortOrder: index }))

            return {
                ...prev,
                files: updated
            };
        })
    }


    // Re-Order image position
    const reorderImage = (targetIndex: number) => {
        if (dragIndex === null || dragIndex === targetIndex) {
            setDragIndex(null)
            return
        }

        setFormData(prev => {

            const files = [...prev.files]

            const [ moved ] = files.splice(dragIndex, 1)
            
            files.splice(targetIndex, 0, moved)

            const updated = files.map((image, index) => ({ ...image, sortOrder: index }))

            return {
                ...prev,
                files: updated
            }
        })

        setDragIndex(null)
    }


    // Set primary image
    const setPrimary = (id: string) => {
        
        setFormData(prev => {
            
            const files = [...prev.files]
            
            const primary = files.map(image => {
                return {
                    ...image,
                    isPrimary: image.uniqueId === id
                }
            })

            return {
                ...prev,
                files: primary
            }

        })

    }


    // Remove images
    const removeImage = (id: string) => {
        setFormData(prev => {
            
            const files = [...prev.files]
            
            const updated = files.filter(image => image.uniqueId !== id)

            return {
                ...prev,
                files: updated
            }

        })
    }

    
    // Save Update Product
    const save = () => {
        console.log(formData)
    }

    return (
        <>
            <div className="space-y-6">
                
                {/* Product Basic Information */}
                <SectionCard title="Basic Info" subtitle="Name, category and description of your product" >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        
                        {/* Product Name Field */}
                        <div className="md:col-span-2">
                            <Field>
                                <FieldLabel htmlFor="productName">
                                    Product Name <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input 
                                    id="productName" 
                                    name="name"
                                    type="text" 
                                    placeholder="e.g. Minimal Cotton T-Shirt" 
                                    aria-invalid={errors.name ? true : false}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                { errors.name && (<FieldError>{errors.name}</FieldError>) }
                            </Field>
                        </div>

                        {/* Slug Field */}
                        <div className="md:col-span-2">
                            <div className="flex items-end gap-2">
                                <Field>
                                    <FieldLabel htmlFor="productSlug">
                                        Slug <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput 
                                            id="productSlug" 
                                            name="slug"
                                            type="text"
                                            placeholder="auto-generated-from-name"
                                            aria-invalid={errors.slug ? true : false}
                                            onBlur={handleSlugBlur}
                                            readOnly={!slugEditing}
                                            disabled={!slugEditing}
                                            value={formData.slug}
                                            onChange={handleChange} 
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText>/products/</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                                {
                                    slugEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                title="Regenerate from name"
                                                onClick={regenerateSlug}
                                                className="cursor-pointer rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                            >
                                                <RefreshCw className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Lock slug (auto-generate from name)"
                                                onClick={() => setSlugEditing(false)}
                                                className="cursor-pointer rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                            >
                                                <Lock className="size-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            title="Edit slug"
                                            onClick={() => setSlugEditing(true)}
                                            className="cursor-pointer rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                        >
                                            <Pencil className="size-4" />
                                        </button>
                                    )
                                }
                            </div>
                            { errors.slug && (<FieldError className="mt-3">{errors.slug}</FieldError>) }
                        </div>
                        
                        {/* Category Field */}
                        <div className={`${formData.hasVariant ? 'md:col-span-2' : '' }`}>
                            <Field>
                                <FieldLabel htmlFor="productCategory">
                                    Category <span className="text-red-500">*</span>
                                </FieldLabel>
                                <SelectCategory 
                                    onSelected={selectedCategories}
                                    value={formData.category}
                                />
                                { errors.categoryId && (<FieldError>{errors.categoryId}</FieldError>) }
                            </Field>
                        </div>

                        {/* SKU Field */}
                        {
                            !formData.hasVariant ? (
                                <Field>
                                    <FieldLabel htmlFor="productSku">
                                        SKU <span className="text-xs font-normal text-sidebar-foreground/40">(base SKU if no variants)</span>
                                    </FieldLabel>
                                    <Input 
                                        id="productSku" 
                                        name="sku"
                                        type="text" 
                                        placeholder="e.g. MCT-001" 
                                        value={formData.sku}
                                        onChange={handleChange}
                                    />
                                </Field>
                            ) : null
                        }

                        {/* Short Description Field */}
                        <div className="md:col-span-2">
                            <Field>
                                <FieldLabel htmlFor="productShortDescription">
                                    Short Description <span className="text-xs font-normal text-sidebar-foreground/40">(shown on listing cards)</span>
                                </FieldLabel>
                                <Input 
                                    id="productShortDescription" 
                                    name="shortDescription"
                                    type="text" 
                                    placeholder="A short summary shown on product cards"
                                    value={formData.shortDescription}
                                    onChange={handleChange} 
                                />
                            </Field>
                        </div>

                        {/* Product Description Field */}
                        <div className="md:col-span-2">
                            <Field>
                                <FieldLabel htmlFor="productDescription">
                                    Description
                                </FieldLabel>
                                <Textarea 
                                    id="productDescription" 
                                    name="description"
                                    placeholder="Full product detail page description..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Field>
                        </div>
                    </div>
                </SectionCard>


                {/* Product Images */}
                <SectionCard 
                        title="Images"
                        subtitle={`Add product photos. First image is set as primary — drag thumbnails to reorder. JPG, PNG or WEBP up to ${MAX_IMAGE_SIZE_MB}MB.`}
                    >
                    <div
                            onDragOver={(e) => {
                                e.preventDefault()
                                setDragOver(true)
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                                e.preventDefault()
                                setDragOver(false)
                                addImageFiles(e.dataTransfer.files)
                            }}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                            dragOver
                                ? "border-primary bg-primary/5"
                                : "border-sidebar-border bg-sidebar-accent/30 hover:bg-sidebar-accent/60"
                            }`}
                        >
                        <UploadCloud className={`size-8 ${dragOver ? "text-primary" : "text-sidebar-foreground/40"}`} />
                        <p className="mt-3 text-sm font-medium text-sidebar-foreground">
                            Drag & drop images here, or{" "}
                            <label htmlFor="productImageUpload" className="cursor-pointer text-primary underline underline-offset-2">
                                browse
                            </label>
                        </p>
                        <p className="mt-1 text-xs text-sidebar-foreground/40">
                            JPG, PNG, WEBP — max {MAX_IMAGE_SIZE_MB}MB per file
                        </p>
                        <input
                            id="productImageUpload"
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) addImageFiles(e.target.files)
                                e.target.value = ""
                            }}
                        />
                    </div>
                    { imagesError && <FieldError className="mt-3">{imagesError}</FieldError> }
                    {formData.files.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                            {
                                formData.files.map((image, index) => (
                                    <div
                                        key={image.uniqueId}
                                        draggable
                                        onDragStart={() => setDragIndex(index)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => reorderImage(index)}
                                        className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent active:cursor-grabbing ${
                                            dragIndex === index ? "opacity-40" : ""
                                        }`}
                                    >
                                        <img src={image.preview} alt={"Product image"} className="object-cover w-full h-full" />
                                        {image.isPrimary && (
                                            <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                                Primary
                                            </span>
                                        )}
                                        <span className="absolute right-1.5 top-1.5 text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                                            <GripVertical className="size-4" />
                                        </span>
                                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/60 to-transparent p-1.5">
                                        <button
                                                type="button"
                                                onClick={() => setPrimary(image.uniqueId)}
                                                title="Set as primary image"
                                                className="rounded p-1 transition-colors hover:bg-white/20"
                                            >
                                            <Star className={`size-4 ${image.isPrimary ? "fill-amber-400 text-amber-400" : "text-white"}`} />
                                        </button>
                                        <span className="text-[10px] font-medium text-white/80">#{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.uniqueId)}
                                            title="Remove image"
                                            className="rounded p-1 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </SectionCard>

                
                {/* Pricing */}
                <SectionCard title="Pricing" subtitle="Prices, cost and shipping weight">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        
                        {/* Base Price Field */}
                        <div>
                            <div className="flex items-end gap-2">
                                <Field>
                                    <FieldLabel htmlFor="productBasePrice">
                                        Base Price <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput 
                                            id="productBasePrice" 
                                            name="price"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            aria-invalid={errors.price ? true : false}
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                        <InputGroupAddon>
                                            <PhilippinePeso />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    { errors.price && (<FieldError>{errors.price}</FieldError>) }
                                </Field>
                            </div>
                        </div>

                        {/* Compare Price Field */}
                        <div>
                            <div className="flex items-end gap-2">
                                <Field>
                                    <FieldLabel htmlFor="productComparePrice">
                                        Compare Price <span className="text-xs font-normal text-sidebar-foreground/40">(shown as strikethrough)</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput 
                                            id="productComparePrice" 
                                            name="comparePrice"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.comparePrice}
                                            onChange={handleChange}
                                        />
                                        <InputGroupAddon>
                                            <PhilippinePeso />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                            </div>
                        </div>

                        {/* Cost Price Field */}
                        <div>
                            <div className="flex items-end gap-2">
                                <Field>
                                    <FieldLabel htmlFor="productCostPrice">
                                        Cost Price <span className="text-xs font-normal text-sidebar-foreground/40">(admin-only, internal)</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput 
                                            id="productCostPrice" 
                                            name="costPrice"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.costPrice}
                                            onChange={handleChange}
                                        />
                                        <InputGroupAddon>
                                            <PhilippinePeso />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                            </div>
                        </div>

                        {/* Weight Field */}
                        <div>
                            <div className="flex items-end gap-2">
                                <Field>
                                    <FieldLabel htmlFor="productWeight">
                                        Weight <span className="text-xs font-normal text-sidebar-foreground/40">(for shipping calculation)</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput 
                                            id="productWeight" 
                                            name="weight"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.weight}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </Field>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <div className="flex items-center justify-end">
                    <Button
                        type="button"
                        disabled={isButtonLoading}
                        onClick={save}
                        className="cursor-pointer"
                    >
                        {
                            isButtonLoading ? <Spinner className="size-4" /> : <Send className="size-4" />
                        }
                        Publish Product
                    </Button>
                </div>
            </div>
        </>
    )
}