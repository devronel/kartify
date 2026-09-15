"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import SectionCard from "../shared/SectionCard";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { GripVertical, Lock, Pencil, PhilippinePeso, RefreshCw, Send, Star, Trash2, UploadCloud } from "lucide-react";
import SelectCategory from "../categories/category-select";
import { Category } from "@/types/admin/category";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";
import { slugify, slugifyFinal, uid } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { ProductFormValues, ProductImage, ProductVariant } from "@/types/product";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ProductAttributeList from "./components/product-attribute-list";
import apiClient, { isAxiosError } from "@/lib/api-client";
import { ValidationErrorResponse } from "@/types/api-error";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE_MB = 5

export default function ProductFormCreate(){

    const [dragOver, setDragOver] = useState<boolean>(false)
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [imagesError, setImagesError] = useState<string>("")
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [slugEditing, setSlugEditing] = useState<boolean>(false)
    const [images, setImages] = useState<ProductImage[]>([])
    const [formData, setFormData] = useState<ProductFormValues>({
        name: '',
        slug: '',
        categoryId: null,
        sku: '',
        shortDescription: '',
        description: '',
        price: '',
        comparePrice: '',
        costPrice: '',
        weight: 0,
        hasVariant: false,
        stockQuantity: 0,
        isActive: true,
        isFeatured: false
    });
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([])

    // Handle variants 
    const handleVariantsChange = (variants: ProductVariant[]) => {
        setProductVariants(variants)
    }

    // Selected Category
    const selectedCategories = (category: Category) => {
        if(category){
            setFormData(prev => ({
                ...prev,
                categoryId: category.id
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

    // Add images
    const addImageFiles = (files: FileList | File[]) => {
        const list = Array.from(files)
        const valid = list.filter((imageType) => ACCEPTED_IMAGE_TYPES.includes(imageType.type))
        const rejected = list.length - valid.length
        const oversized = valid.filter((imageSize) => imageSize.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
        const ok = valid.filter((imageSize) => imageSize.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024)
    
        const messages: string[] = []
        if (rejected > 0) messages.push(`Skipped ${rejected} file(s). Only JPG, PNG, or WEBP images are allowed.`)
        if (oversized.length > 0) messages.push(`Skipped ${oversized.length} file(s) larger than ${MAX_IMAGE_SIZE_MB}MB.`)
        setImagesError(messages.join(" "))
    
        if (ok.length === 0) return
    
        setImages((prev) => {
            const added = ok.map<ProductImage>((file) => ({
                id: uid(),
                file,
                preview: URL.createObjectURL(file),
                isPrimary: false,
                sortOrder: prev.length,
            }))
    
            if (added.length > 0 && !prev.some((image) => image.isPrimary)) {
                added[0].isPrimary = true
            }
    
            return [...prev, ...added].map((image, index) => ({ ...image, sortOrder: index }))
    
        })
    }

    // Re-Order image position
    const reorderImage = (targetIndex: number) => {
        if (dragIndex === null || dragIndex === targetIndex) {
            setDragIndex(null)
            return
        }

        setImages((prev) => {
            const next = [...prev]
            const [moved] = next.splice(dragIndex, 1)
            next.splice(targetIndex, 0, moved)
            return next.map((img, index) => ({ ...img, sortOrder: index }))
        })

        setDragIndex(null)
    }

    // Set Image as Primary
    const setPrimary = (id: string) => {
        setImages((prev) => prev.map((image) => ({ ...image, isPrimary: image.id === id })))
    }

    // Remove Image
    const removeImage = (id: string) => {
        console.log("Running Remove Image")
    }

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

    // Save Data
    const save = async () => {
        try {

            // Organize the payload data
            const data = {
                ...formData,
                files: images.map(image => ({
                    file: image.file,
                    isPrimary: image.isPrimary
                })),
                variants: productVariants
            }
            
            // Create form data object
            const payload = new FormData()

            // Add product info., pricing and images in FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                if(key === 'files'){
                    (value as ProductImage[]).forEach((image, index) => {
                        payload.append(`files[${index}].file`, image.file);
                        payload.append(`files[${index}].isPrimary`, image.isPrimary.toString());
                    })
                }else if(key === 'variants'){
                    (value as ProductVariant[]).forEach((variant, index) => {
                        variant.attributeValues.forEach((attributeValue, idx) => {
                            payload.append(`variants[${index}].attributeValueIds[${idx}]`, attributeValue.id.toString());
                        })
                        payload.append(`variants[${index}].sku`, variant.sku);
                        payload.append(`variants[${index}].price`, variant.price);
                        payload.append(`variants[${index}].comparePrice`, variant.comparePrice);
                        payload.append(`variants[${index}].costPrice`, variant.costPrice);
                        payload.append(`variants[${index}].isActive`, variant.isActive.toString());
                        payload.append(`variants[${index}].stockQuantity`, variant.stockQuantity.toString());
                    })
                }else{
                    payload.append(key, String(value));
                }

            });

            setIsButtonLoading(true)

            const response = await apiClient.post('/api/admin/product', payload)

            if(response.data.success){

                toast.add({
                    type: "success",
                    description: "New Product Created Successfully.",
                })

                // Reset the state fields
                setFormData({
                    name: '',
                    slug: '',
                    categoryId: null,
                    sku: '',
                    shortDescription: '',
                    description: '',
                    price: '',
                    comparePrice: '',
                    costPrice: '',
                    weight: 0,
                    hasVariant: false,
                    stockQuantity: 0,
                    isActive: true,
                    isFeatured: false
                })
                setProductVariants([])
                setImages([])
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
            setIsButtonLoading(false)
        }

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
                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                            {
                                images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        draggable
                                        onDragStart={() => setDragIndex(index)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => reorderImage(index)}
                                        className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent active:cursor-grabbing ${
                                            dragIndex === index ? "opacity-40" : ""
                                        }`}
                                    >
                                        <Image src={image.preview} alt={"Product image"} fill unoptimized className="object-cover" />
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
                                                onClick={() => setPrimary(image.id)}
                                                title="Set as primary image"
                                                className="rounded p-1 transition-colors hover:bg-white/20"
                                            >
                                            <Star className={`size-4 ${image.isPrimary ? "fill-amber-400 text-amber-400" : "text-white"}`} />
                                        </button>
                                        <span className="text-[10px] font-medium text-white/80">#{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.id)}
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

                {/* Product Variant */}
                <SectionCard
                    title="Inventory / Variants"
                    subtitle="Stock and size/color combinations"
                    action={
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-sidebar-foreground">Has Variants?</p>
                                <p className="text-xs text-sidebar-foreground/50">
                                    {formData.hasVariant ? "Multiple size/color combos" : "Simple product"}
                                </p>
                            </div>
                            <Switch 
                                id="hasVariant" 
                                checked={formData.hasVariant} 
                                onCheckedChange={(value) => {
                                    setFormData(prev => ({
                                     ...prev, hasVariant: value 
                                    }))

                                    if(!value){
                                        setProductVariants([])
                                    }
                                }} 
                            />
                        </div>
                    }
                >
                    {
                        !formData.hasVariant ? (
                            <div className="sm:max-w-xs">
                                <Field>
                                    <FieldLabel htmlFor="productStockQuantity">
                                        Stock Quantity <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="productStockQuantity"
                                        name="stockQuantity"
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                    />
                                </Field>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-foreground/60">
                                            1
                                        </span>
                                        <h3 className="text-sm font-semibold text-sidebar-foreground">Attribute Selection</h3>
                                    </div>
                                    <p className="mb-4 text-sm text-sidebar-foreground/60">
                                        Choose the attributes and values your variants are made of.
                                    </p>
                                </div>
                                <ProductAttributeList 
                                    onVariantsChange={handleVariantsChange}
                                    variantErrors={errors}
                                />
                            </div>
                        )
                    }
                    

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