"use client"

import { Field, FieldLabel } from "@/components/ui/field";
import SectionCard from "../shared/SectionCard";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { GripVertical, Lock, Pencil, RefreshCw, Send, Star, Trash2, UploadCloud } from "lucide-react";
import SelectCategory from "../categories/category-select";
import { Category } from "@/types/admin/category";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";
import { uid } from "@/lib/helper";
import { Button } from "@/components/ui/button";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE_MB = 5

type ProductImage = {
  id: string
  file: File
  preview: string
  isPrimary: boolean
  sortOrder: number
}

export default function ProductFormCreate(){

    const [dragOver, setDragOver] = useState<boolean>(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [imagesError, setImagesError] = useState<string>("");
    const [images, setImages] = useState<ProductImage[]>([])

    // Selected Category
    const selectedCategories = (category: Category) => {
        console.log(category)
        // if(category){
        //     setCategory(prev => ({
        //         ...prev,
        //         parentId: category.id
        //     }))
        // }
    }

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

    // Save Data
    const save = () => {
        console.log(images)
    }

    return (
        <>
            <div className="space-y-6">
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
                                    name="productName"
                                    type="text" 
                                    placeholder="e.g. Minimal Cotton T-Shirt" 
                                />
                            </Field>
                        </div>

                        {/* Slug Field */}
                        <div className="md:col-span-2">
                            <div className="flex items-end gap-2">
                                <Field>
                                    <FieldLabel htmlFor="slug">
                                        Slug <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput 
                                            id="slug" 
                                            name="slug"
                                            type="text"
                                            placeholder="auto-generated-from-name" 
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText>/products/</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                                {false ? (
                                    <>
                                        <button
                                            type="button"
                                            title="Regenerate from name"
                                            className="rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                        >
                                            <RefreshCw className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Lock slug (auto-generate from name)"
                                            className="rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                        >
                                            <Lock className="size-4" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        title="Edit slug"
                                        className="rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Category Field */}
                        <Field>
                            <FieldLabel htmlFor="category">
                                Category <span className="text-red-500">*</span>
                            </FieldLabel>
                            <SelectCategory 
                                onSelected={selectedCategories}
                            />
                        </Field>

                        {/* SKU Field */}
                        <Field>
                            <FieldLabel htmlFor="productSku">
                                SKU <span className="text-xs font-normal text-sidebar-foreground/40">(base SKU if no variants)</span>
                            </FieldLabel>
                            <Input 
                                id="productSku" 
                                name="productSku"
                                type="text" 
                                placeholder="e.g. MCT-001" 
                            />
                        </Field>

                        {/* Short Description Field */}
                        <div className="md:col-span-2">
                            <Field>
                                <FieldLabel htmlFor="productShortDescription">
                                    Short Description <span className="text-xs font-normal text-sidebar-foreground/40">(shown on listing cards)</span>
                                </FieldLabel>
                                <Input 
                                    id="productShortDescription" 
                                    name="productShortDescription"
                                    type="text" 
                                    placeholder="A short summary shown on product cards" 
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
                                    name="productDescription"
                                    placeholder="Full product detail page description..."
                                />
                            </Field>
                        </div>
                    </div>
                </SectionCard>

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
                <Button
                    type="button"
                    onClick={save}
                >
                    <Send className="size-4" />
                    Publish Product
                </Button>
            </div>
        </>
    )
}