"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/admin/categories/Toggle"
import {
  Check,
  ChevronDown,
  FolderTree,
  ImagePlus,
  RefreshCw,
  Search,
  Upload,
  X,
} from "lucide-react"

export type CategoryFormData = {
  name: string
  slug: string
  parentId: number | null
  description?: string
  image?: File
  isActive: boolean
}

type ParentOption = {
  id: number
  name: string
  path: string
  depth: number
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE_MB = 5

const inputClass =
  "w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors"

const errorInputClass = "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"

const labelClass = "block text-sm font-medium text-sidebar-foreground mb-1.5"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-red-500">{message}</p>
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function ParentSelect({
  value,
  options,
  onChange,
}: {
  value: number | null
  options: ParentOption[]
  onChange: (id: number | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selected = options.find((o) => o.id === value)
  const filtered = options.filter(
    (o) =>
      !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.path.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 text-left ${inputClass}`}
      >
        <span className={value !== null ? "text-sidebar-foreground" : "text-sidebar-foreground/40"}>
          {value !== null && selected ? selected.path : "None — top level"}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-sidebar-foreground/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1 w-full min-w-56 rounded-xl border border-sidebar-border bg-sidebar shadow-lg">
            <div className="border-b border-sidebar-border p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sidebar-foreground/40" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className={`${inputClass} h-8 pl-9`}
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-auto p-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <FolderTree className="size-4 shrink-0 text-sidebar-foreground/40" />
                  <span>None — top level</span>
                  {value === null && <Check className="ml-auto size-4 shrink-0 text-primary" />}
                </button>
              </li>
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-sidebar-foreground/40">
                  No categories match your search
                </li>
              )}
              {filtered.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.id)
                      setOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                    style={{ paddingLeft: 8 + option.depth * 16 }}
                  >
                    <FolderTree className="size-4 shrink-0 text-sidebar-foreground/40" />
                    <span className="truncate">{option.name}</span>
                    {value === option.id && <Check className="ml-auto size-4 shrink-0 text-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function CategoryModalForm({
  mode,
  initialData,
  parentOptions,
  onClose,
  onSave,
}: {
  mode: "create" | "edit"
  initialData: CategoryFormData
  parentOptions: ParentOption[]
  onClose: () => void
  onSave: (data: CategoryFormData) => void
}) {
  const [name, setName] = useState(initialData.name)
  const [slug, setSlug] = useState(initialData.slug)
  const [slugTouched, setSlugTouched] = useState(false)
  const [parentId, setParentId] = useState<number | null>(initialData.parentId)
  const [description, setDescription] = useState(initialData.description ?? "")
  const [imageFile, setImageFile] = useState<File | undefined>(initialData.image)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.image ? URL.createObjectURL(initialData.image) : null
  )
  const [isActive, setIsActive] = useState(initialData.isActive)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleImageSelect = (file: File | undefined) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    if (!file) {
      setImageFile(undefined)
      setImagePreview(null)
      return
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "Name is required"
    if (!slug.trim()) errs.slug = "Slug is required"
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    onSave({
      name: name.trim(),
      slug: slugify(slug),
      parentId,
      description: description.trim() || undefined,
      image: imageFile,
      isActive,
    })
  }

  return (
    <>
      <div className="flex shrink-0 items-start justify-between border-b border-sidebar-border p-5">
        <div>
          <DialogPrimitive.Title className="text-lg font-semibold">
            {mode === "create" ? "Add Category" : `Edit Category — ${initialData.name || "Untitled"}`}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-0.5 text-sm text-sidebar-foreground/60">
            {mode === "create"
              ? "Create a new category and nest it under a parent if needed"
              : "Update the category details below"}
          </DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close render={<Button variant="ghost" size="icon-sm" />}>
          <X />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
        <div>
          <label htmlFor="category-name" className={labelClass}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Shirts"
            className={`${inputClass} ${errors.name ? errorInputClass : ""}`}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <label htmlFor="category-slug" className={labelClass}>
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex items-stretch gap-2">
            <input
              id="category-slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              placeholder="auto-generated-from-name"
              className={`${inputClass} ${errors.slug ? errorInputClass : ""}`}
            />
            <button
              type="button"
              onClick={() => {
                setSlug(slugify(name))
                setSlugTouched(false)
              }}
              title="Regenerate from name"
              className="shrink-0 rounded-lg border border-sidebar-border p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
          <FieldError message={errors.slug} />
        </div>

        <div>
          <label className={labelClass}>
            Parent Category <span className="text-xs font-normal text-sidebar-foreground/40">(optional)</span>
          </label>
          <ParentSelect value={parentId} options={parentOptions} onChange={setParentId} />
        </div>

        <div>
          <label htmlFor="category-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="category-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional category description..."
            rows={3}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>

        <div>
          <label className={labelClass}>
            Image <span className="text-xs font-normal text-sidebar-foreground/40">(optional)</span>
          </label>
          {imagePreview ? (
            <div className="flex items-center gap-3">
              <div className="relative size-16 overflow-hidden rounded-lg border border-sidebar-border">
                <Image src={imagePreview} alt={name || "Category image"} fill unoptimized className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-sidebar-foreground/50">
                  JPG, PNG or WEBP up to {MAX_IMAGE_SIZE_MB}MB
                </span>
                <div className="flex gap-2">
                  <label className="cursor-pointer rounded-lg border border-sidebar-border px-2.5 py-1.5 text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
                    <ImagePlus className="mr-1.5 inline size-3.5" />
                    Replace
                    <input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      className="hidden"
                      onChange={(e) => {
                        handleImageSelect(e.target.files?.[0])
                        e.target.value = ""
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleImageSelect(undefined)}
                    className="rounded-lg border border-sidebar-border px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="category-image"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sidebar-border bg-sidebar-accent/30 px-4 py-6 text-center hover:bg-sidebar-accent/60 transition-colors"
            >
              <Upload className="size-6 text-sidebar-foreground/40" />
              <span className="text-sm font-medium text-sidebar-foreground">Click to upload an image</span>
              <span className="text-xs text-sidebar-foreground/40">
                JPG, PNG or WEBP up to {MAX_IMAGE_SIZE_MB}MB
              </span>
              <input
                id="category-image"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  handleImageSelect(e.target.files?.[0])
                  e.target.value = ""
                }}
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Active</p>
            <p className="text-xs text-sidebar-foreground/50">
              Inactive categories are hidden from customers
            </p>
          </div>
          <Toggle checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sidebar-border p-5">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          <Check className="size-4" />
          Save
        </Button>
      </div>
    </>
  )
}

export function CategoryModal({
  open,
  mode,
  initialData,
  parentOptions,
  onClose,
  onSave,
}: {
  open: boolean
  mode: "create" | "edit"
  initialData: CategoryFormData
  parentOptions: ParentOption[]
  onClose: () => void
  onSave: (data: CategoryFormData) => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg transition duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
          <CategoryModalForm
            mode={mode}
            initialData={initialData}
            parentOptions={parentOptions}
            onClose={onClose}
            onSave={onSave}
          />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
