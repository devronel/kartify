"use client"

import { useState, useMemo, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  Boxes,
  Check,
  ChevronDown,
  GripVertical,
  Layers,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Send,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react"
import Toggle from "@/components/shared/ui/Toggle"
import SectionCard from "@/components/admin/shared/SectionCard"
import CategorySelect from "./CategorySelect"
import FieldError from "../shared/FieldError"
import { Attribute, CategoryNode, ProductImage, VariantCombo, VariantRowData } from "@/types/admin/product"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE_MB = 5

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

function cartesian<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>(
    (acc, group) =>
      acc.length === 0 ? group.map((item) => [item]) : acc.flatMap((combo) => group.map((item) => [...combo, item])),
    []
  )
}

// --- Build combo for product variant attribute ---
function buildCombos(selectedAttrs: Attribute[], selectedValueIds: number[]): VariantCombo[] {
  const valueGroups = selectedAttrs.map((attr) =>
    attr.values.filter((attrValue) => selectedValueIds.includes(attrValue.id))
  )
  return cartesian(valueGroups).map((row) => {
    const ids = row.map((v) => v.id).sort((a, b) => a - b)
    return {
      key: ids.join("-"),
      attrValueIds: ids,
      label: row.map((v) => v.name).join(" / "),
    }
  })
}

// --- Default variant data ---
const defaultVariantData = (): VariantRowData => ({
  sku: "",
  price: "",
  stock: "",
  image: null,
  isActive: true,
})

const inputClass = "w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors"
const errorInputClass = "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
const labelClass = "block text-sm font-medium text-sidebar-foreground mb-1.5"

export default function ProductCreateForm({ 
    categories,
    existingProductAttibutes
} : { categories: CategoryNode[], existingProductAttibutes: Attribute[] }) 
{
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEditing, setSlugEditing] = useState(false)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [sku, setSku] = useState("")

  const [images, setImages] = useState<ProductImage[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [imagesError, setImagesError] = useState("")

  const [price, setPrice] = useState("")
  const [comparePrice, setComparePrice] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [weight, setWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg")

  const [hasVariants, setHasVariants] = useState(false)
  const [stockQuantity, setStockQuantity] = useState("")

  const [attributes, setAttributes] = useState<Attribute[]>(existingProductAttibutes)
  const [checkedAttrs, setCheckedAttrs] = useState<number[]>([])
  const [expandedAttrs, setExpandedAttrs] = useState<number[]>(
    existingProductAttibutes.map((existingProductAttribute) => existingProductAttribute.id)
  )
  const [selectedValueIds, setSelectedValueIds] = useState<number[]>([])
  const [attrValueInputs, setAttrValueInputs] = useState<Record<number, string>>({})
  const [newAttributeName, setNewAttributeName] = useState("")

  const [variantData, setVariantData] = useState<Record<string, VariantRowData>>({})
  const [bulkStock, setBulkStock] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveAttempted, setSaveAttempted] = useState(false)
  const [saved, setSaved] = useState(false)

  const tempIdRef = useRef(-1)
  const nextTempId = () => tempIdRef.current--

  const variantRows = useMemo(() => {
    const selectedAttrs = attributes.filter((attr) =>
      attr.values.some((v) => selectedValueIds.includes(v.id))
    )
    if (selectedAttrs.length === 0) return []
    return buildCombos(selectedAttrs, selectedValueIds).map((combo) => ({
      ...combo,
      data: variantData[combo.key] ?? defaultVariantData(),
    }))
  }, [attributes, selectedValueIds, variantData])

  const hasErrors = Object.keys(errors).length > 0

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEditing) setSlug(slugify(value))
  }

  const regenerateSlug = () => {
    setSlug(slugify(name))
  }

  const addImageFiles = (files: FileList | File[]) => {
    const list = Array.from(files)
    const valid = list.filter((f) => ACCEPTED_IMAGE_TYPES.includes(f.type))
    const rejected = list.length - valid.length
    const oversized = valid.filter((f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    const ok = valid.filter((f) => f.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024)

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
        isPrimary: prev.length === 0,
        sortOrder: prev.length,
      }))
      return [...prev, ...added].map((img, idx) => ({ ...img, sortOrder: idx }))
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      const next = prev.filter((img) => img.id !== id)
      if (next.length === 0) return next
      const hasPrimary = next.some((img) => img.isPrimary)
      return next.map((img, idx) => ({
        ...img,
        sortOrder: idx,
        isPrimary: hasPrimary ? img.isPrimary : idx === 0,
      }))
    })
  }

  const setPrimary = (id: string) => {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })))
  }

  const reorderImage = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      return
    }
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next.map((img, idx) => ({ ...img, sortOrder: idx }))
    })
    setDragIndex(null)
  }

  const toggleAttribute = (attrId: number) => {
    const attr = attributes.find((a) => a.id === attrId)
    if (!attr) return
    setCheckedAttrs((prev) => {
      if (prev.includes(attrId)) {
        setSelectedValueIds((vals) => vals.filter((id) => !attr.values.some((v) => v.id === id)))
        setExpandedAttrs((exp) => exp.filter((id) => id !== attrId))
        return prev.filter((id) => id !== attrId)
      }
      setSelectedValueIds((vals) => [
        ...new Set([...vals, ...attr.values.map((v) => v.id)]),
      ])
      setExpandedAttrs((exp) => (exp.includes(attrId) ? exp : [...exp, attrId]))
      return [...prev, attrId]
    })
  }

  const toggleExpand = (attrId: number) => {
    setExpandedAttrs((prev) =>
      prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId]
    )
  }

  const toggleValue = (valueId: number) => {
    setSelectedValueIds((prev) => {
      const next = prev.includes(valueId)
        ? prev.filter((id) => id !== valueId)
        : [...prev, valueId]
      const attr = attributes.find((a) => a.values.some((v) => v.id === valueId))
      if (attr) {
        setCheckedAttrs((attrs) =>
          attrs.includes(attr.id) ? attrs : [...attrs, attr.id]
        )
        setExpandedAttrs((exp) => (exp.includes(attr.id) ? exp : [...exp, attr.id]))
      }
      return next
    })
  }

  const addAttributeValue = (attrId: number) => {
    const value = (attrValueInputs[attrId] ?? "").trim()
    if (!value) return
    const id = nextTempId()
    setAttributes((prev) =>
      prev.map((a) =>
        a.id === attrId ? { ...a, values: [...a.values, { id, name: value }] } : a
      )
    )
    setSelectedValueIds((prev) => [...prev, id])
    setCheckedAttrs((prev) => (prev.includes(attrId) ? prev : [...prev, attrId]))
    setExpandedAttrs((prev) => (prev.includes(attrId) ? prev : [...prev, attrId]))
    setAttrValueInputs((prev) => ({ ...prev, [attrId]: "" }))
  }

  const addNewAttribute = () => {
    const value = newAttributeName.trim()
    if (!value) return
    const id = nextTempId()
    setAttributes((prev) => [...prev, { id, name: value, values: [] }])
    setCheckedAttrs((prev) => [...prev, id])
    setExpandedAttrs((prev) => [...prev, id])
    setNewAttributeName("")
  }

  const updateVariantData = (key: string, patch: Partial<VariantRowData>) => {
    setVariantData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? defaultVariantData()), ...patch },
    }))
  }

  const handleVariantImage = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !ACCEPTED_IMAGE_TYPES.includes(file.type)) return
    const existing = variantData[key]?.image
    if (existing) URL.revokeObjectURL(existing.preview)
    updateVariantData(key, { image: { file, preview: URL.createObjectURL(file) } })
  }

  const applyBulkStock = () => {
    if (bulkStock === "") return
    setVariantData((prev) => {
      const next = { ...prev }
      variantRows.forEach((row) => {
        next[row.key] = { ...(next[row.key] ?? defaultVariantData()), stock: bulkStock }
      })
      return next
    })
  }

  const setAllActive = (active: boolean) => {
    setVariantData((prev) => {
      const next = { ...prev }
      variantRows.forEach((row) => {
        next[row.key] = { ...(next[row.key] ?? defaultVariantData()), isActive: active }
      })
      return next
    })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "Product name is required"
    if (!slug.trim()) errs.slug = "Slug is required"
    if (!categoryId) errs.category = "Category is required"

    const num = (v: string) => parseFloat(v)
    if (price === "" || isNaN(num(price)) || num(price) <= 0) {
      errs.price = "Base price must be a positive number"
    } else if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) {
      errs.price = "Price must be a number with up to 2 decimal places"
    }
    if (comparePrice !== "" && (isNaN(num(comparePrice)) || num(comparePrice) <= 0)) {
      errs.comparePrice = "Compare price must be a positive number"
    }
    if (costPrice !== "" && (isNaN(num(costPrice)) || num(costPrice) <= 0)) {
      errs.costPrice = "Cost price must be a positive number"
    }
    if (weight !== "" && (isNaN(num(weight)) || num(weight) <= 0)) {
      errs.weight = "Weight must be a positive number"
    }

    if (!hasVariants) {
      if (stockQuantity === "" || isNaN(parseInt(stockQuantity, 10)) || parseInt(stockQuantity, 10) < 0) {
        errs.stockQuantity = "Stock quantity is required"
      }
    } else {
      if (variantRows.length === 0) {
        errs.variants = "Select at least one attribute value to generate variants"
      } else {
        variantRows.forEach((row) => {
          const data = variantData[row.key] ?? defaultVariantData()
          if (data.stock === "" || data.stock == null) {
            errs[`variant-stock-${row.key}`] = "Required"
          }
        })
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (isActive: boolean) => {
    setSaveAttempted(true)
    setSaved(false)
    if (!validate()) return

    const payload = {
      name,
      slug,
      categoryId,
      shortDescription: shortDescription || undefined,
      description: description || undefined,
      sku: sku || undefined,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      weightUnit: weight ? weightUnit : undefined,
      hasVariants,
      stockQuantity: hasVariants ? undefined : parseInt(stockQuantity, 10),
      isActive,
      isFeatured: false,
      images: images.map((img) => ({
        file: img.file,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      variants: hasVariants
        ? variantRows.map((row) => ({
            attributeValueIds: row.attrValueIds,
            sku: variantData[row.key]?.sku || undefined,
            price: variantData[row.key]?.price ? parseFloat(variantData[row.key]!.price) : undefined,
            stockQuantity: parseInt(variantData[row.key]?.stock ?? "0", 10),
            image: variantData[row.key]?.image?.file,
            isActive: variantData[row.key]?.isActive ?? true,
          }))
        : undefined,
    }

    console.log("Product data (UI only):", payload)
    setSaved(true)
  }

  const errorList = Object.entries(errors)

  return (
    <>
      {saveAttempted && hasErrors && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-red-500">
            <AlertCircle className="size-4" />
            Please fix the following before saving
          </div>
          <ul className="mt-2 list-disc pl-5 text-sm text-red-500/90">
            {errorList.map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-600">
          <Check className="size-4" />
          Product saved (UI only — API integration pending).
        </div>
      )}

      <div className="space-y-6">
        <SectionCard title="Basic Info" subtitle="Name, category and description of your product" >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="product-name" className={labelClass}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Minimal Cotton T-Shirt"
                className={`${inputClass} ${errors.name ? errorInputClass : ""}`}
              />
              <FieldError message={errors.name} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="product-slug" className={labelClass}>
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-stretch">
                <div className="flex items-center rounded-l-lg border border-r-0 border-sidebar-border bg-sidebar-accent px-3 text-sm text-sidebar-foreground/40">
                  /products/
                </div>
                <input
                  id="product-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  readOnly={!slugEditing}
                  placeholder="auto-generated-from-name"
                  className={`flex-1 rounded-r-lg rounded-l-none border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors ${
                    !slugEditing ? "cursor-not-allowed opacity-70" : ""
                  } ${errors.slug ? errorInputClass : ""}`}
                />
                <div className="ml-2 flex items-center gap-1">
                  {slugEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={regenerateSlug}
                        title="Regenerate from name"
                        className="rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      >
                        <RefreshCw className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlugEditing(false)}
                        title="Lock slug (auto-generate from name)"
                        className="rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      >
                        <Lock className="size-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSlugEditing(true)}
                      title="Edit slug"
                      className="rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              <FieldError message={errors.slug} />
            </div>

            <div>
              <label className={labelClass}>
                Category <span className="text-red-500">*</span>
              </label>
              <CategorySelect 
              value={categoryId} 
              onChange={setCategoryId} 
              error={errors.category} 
              categories={categories}
              />
            </div>

            <div>
              <label htmlFor="product-sku" className={labelClass}>
                SKU <span className="text-xs font-normal text-sidebar-foreground/40">(base SKU if no variants)</span>
              </label>
              <input
                id="product-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. MCT-001"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="product-short-description" className={labelClass}>
                Short Description <span className="text-xs font-normal text-sidebar-foreground/40">(shown on listing cards)</span>
              </label>
              <input
                id="product-short-description"
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A short summary shown on product cards"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="product-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="product-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full product detail page description..."
                rows={5}
                className={`${inputClass} resize-y leading-relaxed`}
              />
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
              <label htmlFor="product-image-upload" className="cursor-pointer text-primary underline underline-offset-2">
                browse
              </label>
            </p>
            <p className="mt-1 text-xs text-sidebar-foreground/40">
              JPG, PNG, WEBP — max {MAX_IMAGE_SIZE_MB}MB per file
            </p>
            <input
              id="product-image-upload"
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

          {imagesError && (
            <p className="mt-2 text-xs text-red-500">{imagesError}</p>
          )}

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorderImage(index)}
                  className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent active:cursor-grabbing ${
                    dragIndex === index ? "opacity-40" : ""
                  }`}
                >
                  <Image src={img.preview} alt={name || "Product image"} fill unoptimized className="object-cover" />
                  {img.isPrimary && (
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
                      onClick={() => setPrimary(img.id)}
                      title="Set as primary image"
                      className="rounded p-1 transition-colors hover:bg-white/20"
                    >
                      <Star
                        className={`size-4 ${
                          img.isPrimary ? "fill-amber-400 text-amber-400" : "text-white"
                        }`}
                      />
                    </button>
                    <span className="text-[10px] font-medium text-white/80">#{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      title="Remove image"
                      className="rounded p-1 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Pricing" subtitle="Prices, cost and shipping weight">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="product-price" className={labelClass}>
                Base Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-sidebar-foreground/40">
                  $
                </span>
                <input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-7 ${errors.price ? errorInputClass : ""}`}
                />
              </div>
              {!hasVariants && (
                <p className="mt-1.5 text-xs text-sidebar-foreground/40">
                  Used as the &quot;starting at&quot; price if the product has variants
                </p>
              )}
              <FieldError message={errors.price} />
            </div>

            <div>
              <label htmlFor="product-compare-price" className={labelClass}>
                Compare Price <span className="text-xs font-normal text-sidebar-foreground/40">(shown as strikethrough)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-sidebar-foreground/40">
                  $
                </span>
                <input
                  id="product-compare-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-7 ${errors.comparePrice ? errorInputClass : ""}`}
                />
              </div>
              <FieldError message={errors.comparePrice} />
            </div>

            <div>
              <label htmlFor="product-cost-price" className={labelClass}>
                Cost Price <span className="text-xs font-normal text-sidebar-foreground/40">(admin-only, internal)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-sidebar-foreground/40">
                  $
                </span>
                <input
                  id="product-cost-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-7 ${errors.costPrice ? errorInputClass : ""}`}
                />
              </div>
              <FieldError message={errors.costPrice} />
            </div>

            <div>
              <label htmlFor="product-weight" className={labelClass}>
                Weight <span className="text-xs font-normal text-sidebar-foreground/40">(for shipping calculation)</span>
              </label>
              <div className="flex">
                <input
                  id="product-weight"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} rounded-r-none ${errors.weight ? errorInputClass : ""}`}
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as "kg" | "g")}
                  className="rounded-r-lg border border-l-0 border-sidebar-border bg-sidebar-accent/50 px-3 text-sm text-sidebar-foreground outline-none focus:border-sidebar-ring"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                </select>
              </div>
              <FieldError message={errors.weight} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Inventory / Variants"
          subtitle="Stock and size/color combinations"
          action={
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-sidebar-foreground">Has Variants?</p>
                <p className="text-xs text-sidebar-foreground/50">
                  {hasVariants ? "Multiple size/color combos" : "Simple product"}
                </p>
              </div>
              <Toggle checked={hasVariants} onCheckedChange={setHasVariants} />
            </div>
          }
        >
          {!hasVariants ? (
            <div className="sm:max-w-xs">
              <label htmlFor="product-stock" className={labelClass}>
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0"
                className={`${inputClass} ${errors.stockQuantity ? errorInputClass : ""}`}
              />
              <FieldError message={errors.stockQuantity} />
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

                {attributes.length === 0 && (
                  <p className="mb-4 text-sm text-sidebar-foreground/40">
                    No attributes yet. Add one below to get started.
                  </p>
                )}

                <div className="space-y-3">
                  {attributes.map((attr) => {
                    const checked = checkedAttrs.includes(attr.id)
                    const expanded = expandedAttrs.includes(attr.id)
                    const selectedCount = attr.values.filter((attrValues) =>
                      selectedValueIds.includes(attrValues.id)
                    ).length
                    return (
                      <div key={attr.id} className="overflow-hidden rounded-lg border border-sidebar-border">
                        <div className="flex items-center gap-3 px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAttribute(attr.id)}
                            className="size-4 shrink-0 accent-sidebar-primary"
                          />
                          <button
                            type="button"
                            onClick={() => toggleExpand(attr.id)}
                            className="flex flex-1 items-center gap-2 text-left"
                          >
                            <ChevronDown
                              className={`size-4 shrink-0 text-sidebar-foreground/40 transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                            <span className="text-sm font-medium text-sidebar-foreground">
                              {attr.name}
                            </span>
                          </button>
                          {checked && selectedCount > 0 ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {selectedCount} selected
                            </span>
                          ) : (
                            <span className="text-xs text-sidebar-foreground/40">
                              {attr.values.length} values
                            </span>
                          )}
                        </div>

                        {expanded && (
                          <div className="space-y-2 border-t border-sidebar-border px-3 py-3 pl-12">
                            {attr.values.length > 0 && (
                              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                                {attr.values.map((value) => (
                                  <label
                                    key={value.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-2.5 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedValueIds.includes(value.id)}
                                      onChange={() => toggleValue(value.id)}
                                      className="size-3.5 shrink-0 accent-sidebar-primary"
                                    />
                                    {value.name}
                                  </label>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={attrValueInputs[attr.id] ?? ""}
                                onChange={(e) =>
                                  setAttrValueInputs((prev) => ({
                                    ...prev,
                                    [attr.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    addAttributeValue(attr.id)
                                  }
                                }}
                                placeholder={`Add a value to ${attr.name}...`}
                                className={`${inputClass} h-8 max-w-xs`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addAttributeValue(attr.id)}
                              >
                                <Plus className="size-3.5" />
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 flex max-w-md items-center gap-2">
                  <input
                    type="text"
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addNewAttribute()
                      }
                    }}
                    placeholder="Add a new attribute (e.g. Material)..."
                    className={inputClass}
                  />
                  <Button type="button" variant="outline" onClick={addNewAttribute}>
                    <Plus className="size-4" />
                    Add Attribute
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-foreground/60">
                      2
                    </span>
                    <h3 className="text-sm font-semibold text-sidebar-foreground">Variant Combinations</h3>
                    {variantRows.length > 0 && (
                      <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-foreground/60">
                        {variantRows.length} generated
                      </span>
                    )}
                  </div>
                  {variantRows.length > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={bulkStock}
                        onChange={(e) => setBulkStock(e.target.value)}
                        placeholder="Stock"
                        title="Set stock for all variants"
                        className={`${inputClass} h-8 w-24`}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={applyBulkStock}>
                        Set stock for all
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setAllActive(true)}>
                        Activate all
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setAllActive(false)}>
                        Deactivate all
                      </Button>
                    </div>
                  )}
                </div>

                {variantRows.length > 0 ? (
                  <>
                    <p className="mb-3 text-xs text-sidebar-foreground/40">
                      Regenerating attribute selections preserves any data already entered. Blank
                      price overrides inherit the base price.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px]">
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
                              Stock <span className="text-red-500">*</span>
                            </th>
                            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                              Image
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                              Active
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantRows.map((row) => {
                            const data = variantData[row.key] ?? defaultVariantData()
                            const stockError = errors[`variant-stock-${row.key}`]
                            return (
                              <tr key={row.key} className="border-b border-sidebar-border last:border-0">
                                <td className="px-3 py-2.5 pr-4">
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-sidebar-foreground">
                                    <Layers className="size-3.5 shrink-0 text-sidebar-foreground/40" />
                                    {row.label}
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 pr-4">
                                  <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => updateVariantData(row.key, { sku: e.target.value })}
                                    placeholder="SKU"
                                    className={`${inputClass} h-8`}
                                  />
                                </td>
                                <td className="px-3 py-2.5 pr-4">
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => updateVariantData(row.key, { price: e.target.value })}
                                    placeholder="$ base"
                                    className={`${inputClass} h-8`}
                                  />
                                </td>
                                <td className="px-3 py-2.5 pr-4">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    step="1"
                                    value={data.stock}
                                    onChange={(e) => updateVariantData(row.key, { stock: e.target.value })}
                                    placeholder="0"
                                    className={`${inputClass} h-8 ${stockError ? errorInputClass : ""}`}
                                  />
                                  {stockError && <p className="mt-1 text-xs text-red-500">{stockError}</p>}
                                </td>
                                <td className="px-3 py-2.5 pr-4">
                                  {data.image ? (
                                    <div className="relative size-9">
                                      <Image
                                        src={data.image.preview}
                                        alt={row.label}
                                        fill
                                        unoptimized
                                        className="rounded-md object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          URL.revokeObjectURL(data.image!.preview)
                                          updateVariantData(row.key, { image: null })
                                        }}
                                        title="Remove image"
                                        className="absolute -right-1.5 -top-1.5 rounded-full bg-sidebar-foreground text-background p-0.5 shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                                      >
                                        <Trash2 className="size-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <label
                                      title="Upload variant image"
                                      className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-dashed border-sidebar-border text-sidebar-foreground/40 hover:border-primary hover:text-primary transition-colors"
                                    >
                                      <Plus className="size-4" />
                                      <input
                                        type="file"
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                        className="hidden"
                                        onChange={(e) => handleVariantImage(row.key, e)}
                                      />
                                    </label>
                                  )}
                                </td>
                                <td className="px-3 py-2.5 text-right">
                                  <Toggle
                                    size="sm"
                                    checked={data.isActive}
                                    onCheckedChange={(checked) =>
                                      updateVariantData(row.key, { isActive: checked })
                                    }
                                  />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-sidebar-border p-10 text-center">
                    <Boxes className="mx-auto size-8 text-sidebar-foreground/30" />
                    <p className="mt-3 text-sm font-medium text-sidebar-foreground">
                      No variants generated yet
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-sidebar-foreground/50">
                      Check at least one attribute and select its values above to auto-generate all
                      size/color combinations.
                    </p>
                  </div>
                )}
                <FieldError message={errors.variants} />
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="sticky bottom-0 z-10 -mx-6 mt-8 border-t border-sidebar-border bg-sidebar/95 px-6 py-4 backdrop-blur">
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-sidebar-foreground/50">
            {saveAttempted && hasErrors ? (
              <span className="flex items-center gap-1.5 font-medium text-red-500">
                <AlertCircle className="size-4" />
                {errorList.length} field{errorList.length === 1 ? "" : "s"} need attention
              </span>
            ) : hasVariants ? (
              <span>
                {variantRows.length} variant{variantRows.length === 1 ? "" : "s"} · {images.length} image
                {images.length === 1 ? "" : "s"}
              </span>
            ) : (
              <span>{images.length} image{images.length === 1 ? "" : "s"}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saved}
            >
              <Save className="size-4" />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saved}
            >
              <Send className="size-4" />
              Publish Product
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
