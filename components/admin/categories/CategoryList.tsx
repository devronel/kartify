"use client"

import { useMemo, useState } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Button } from "@/components/ui/button"
import { CategoryModal, type CategoryFormData } from "@/components/admin/categories/CategoryModal"
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Folder,
  FolderOpen,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

type Category = {
  id: number
  parentId: number | null
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  productCount: number
  children?: Category[]
}

type ParentOption = {
  id: number
  name: string
  path: string
  depth: number
}

type ModalState =
  | { mode: "create"; initial: CategoryFormData }
  | { mode: "edit"; id: number; initial: CategoryFormData }

const initialCategories: Category[] = [
  { id: 1, parentId: null, name: "Clothing", slug: "clothing", description: "Apparel of all kinds", isActive: true, sortOrder: 0, productCount: 12 },
  { id: 2, parentId: 1, name: "Men", slug: "clothing-men", isActive: true, sortOrder: 0, productCount: 3 },
  { id: 3, parentId: 2, name: "Shirts", slug: "clothing-men-shirts", isActive: true, sortOrder: 0, productCount: 8 },
  { id: 4, parentId: 2, name: "Pants", slug: "clothing-men-pants", isActive: true, sortOrder: 1, productCount: 0 },
  { id: 5, parentId: 1, name: "Women", slug: "clothing-women", isActive: true, sortOrder: 1, productCount: 2 },
  { id: 6, parentId: 5, name: "Dresses", slug: "clothing-women-dresses", isActive: true, sortOrder: 0, productCount: 4 },
  { id: 7, parentId: 5, name: "Skirts", slug: "clothing-women-skirts", isActive: false, sortOrder: 1, productCount: 0 },
  { id: 8, parentId: null, name: "Footwear", slug: "footwear", isActive: true, sortOrder: 1, productCount: 7 },
  { id: 9, parentId: 8, name: "Sneakers", slug: "footwear-sneakers", isActive: true, sortOrder: 0, productCount: 4 },
  { id: 10, parentId: 8, name: "Boots", slug: "footwear-boots", isActive: true, sortOrder: 1, productCount: 3 },
  { id: 11, parentId: null, name: "Accessories", slug: "accessories", isActive: true, sortOrder: 2, productCount: 1 },
  { id: 12, parentId: 11, name: "Bags", slug: "accessories-bags", isActive: true, sortOrder: 0, productCount: 9 },
  { id: 13, parentId: 11, name: "Watches", slug: "accessories-watches", isActive: true, sortOrder: 1, productCount: 2 },
]

function buildTree(flat: Category[]): Category[] {
  const byParent = new Map<number | null, Category[]>()
  for (const cat of flat) {
    const arr = byParent.get(cat.parentId) ?? []
    arr.push({ ...cat, children: [] })
    byParent.set(cat.parentId, arr)
  }
  for (const arr of byParent.values()) arr.sort((a, b) => a.sortOrder - b.sortOrder)

  const attach = (node: Category) => {
    node.children = (byParent.get(node.id) ?? []).map((child) => attach(child))
    return node
  }

  return (byParent.get(null) ?? []).map(attach)
}

function collectCategoryIdsWithChildren(nodes: Category[], out: number[] = []): number[] {
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      out.push(node.id)
      collectCategoryIdsWithChildren(node.children, out)
    }
  }
  return out
}

function flattenTree(nodes: Category[], prefix: string[] = [], out: ParentOption[] = []): ParentOption[] {
  for (const node of nodes) {
    const path = [...prefix, node.name]
    out.push({ id: node.id, name: node.name, path: path.join(" > "), depth: path.length - 1 })
    if (node.children && node.children.length > 0) flattenTree(node.children, path, out)
  }
  return out
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [expanded, setExpanded] = useState<number[]>(collectCategoryIdsWithChildren(buildTree(initialCategories)))
  const [modal, setModal] = useState<ModalState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const tree = useMemo(() => buildTree(categories), [categories])

  const nestedById = useMemo(() => {
    const map = new Map<number, Category>()
    const walk = (nodes: Category[]) => {
      for (const node of nodes) {
        map.set(node.id, node)
        if (node.children) walk(node.children)
      }
    }
    walk(tree)
    return map
  }, [tree])

  const parentOptions = useMemo(() => {
    const excluded = new Set<number>()
    if (modal?.mode === "edit") {
      const collect = (node: Category) => {
        excluded.add(node.id)
        node.children?.forEach(collect)
      }
      const target = nestedById.get(modal.id)
      if (target) collect(target)
    }
    return flattenTree(tree).filter((option) => !excluded.has(option.id))
  }, [tree, modal, nestedById])

  const allExpandableIds = useMemo(() => collectCategoryIdsWithChildren(tree), [tree])

  const totalProducts = useMemo(() => categories.reduce((sum, c) => sum + c.productCount, 0), [categories])

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const openCreate = () => {
    setModal({
      mode: "create",
      initial: { name: "", slug: "", parentId: null, description: "", isActive: true },
    })
  }

  const openEdit = (category: Category) => {
    setModal({
      mode: "edit",
      id: category.id,
      initial: {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        description: category.description ?? "",
        isActive: category.isActive,
      },
    })
  }

  const handleSaveCategory = (data: CategoryFormData) => {
    if (modal?.mode === "edit") {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === modal.id
            ? {
                ...c,
                name: data.name,
                slug: data.slug,
                parentId: data.parentId,
                description: data.description,
                isActive: data.isActive,
              }
            : c
        )
      )
      setNotice(`Category "${data.name}" updated`)
    } else {
      const nextId = Math.max(0, ...categories.map((c) => c.id)) + 1
      const parentId = data.parentId
      setCategories((prev) => [
        ...prev,
        {
          id: nextId,
          parentId,
          name: data.name,
          slug: data.slug,
          description: data.description,
          isActive: data.isActive,
          sortOrder: 0,
          productCount: 0,
        },
      ])
      if (parentId !== null) {
        setExpanded((prev) => (prev.includes(parentId) ? prev : [...prev, parentId]))
      }
      setNotice(`Category "${data.name}" created`)
    }
    setModal(null)
  }

  const deleteBlocked = deleteTarget
    ? (deleteTarget.productCount ?? 0) > 0 || (deleteTarget.children?.length ?? 0) > 0
    : false

  const deleteBlockMessage = (() => {
    if (!deleteTarget) return ""
    const products = deleteTarget.productCount ?? 0
    const subcats = deleteTarget.children?.length ?? 0
    if (products > 0 && subcats > 0) {
      return `Cannot delete: this category has ${products} products and ${subcats} subcategor${subcats === 1 ? "y" : "ies"}. Reassign or remove them first.`
    }
    if (products > 0) {
      return `Cannot delete: this category has ${products} product${products === 1 ? "" : "s"} assigned. Reassign or remove them first.`
    }
    return `Cannot delete: this category has ${subcats} subcategor${subcats === 1 ? "y" : "ies"}. Move or remove them first.`
  })()

  const confirmDelete = () => {
    if (!deleteTarget || deleteBlocked) return
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setExpanded((prev) => prev.filter((id) => id !== deleteTarget.id))
    setNotice(`Category "${deleteTarget.name}" deleted`)
    setDeleteTarget(null)
  }

  const renderRows = (nodes: Category[], depth: number): React.ReactElement[] => {
    const rows: React.ReactElement[] = []
    for (const cat of nodes) {
      const hasChildren = (cat.children?.length ?? 0) > 0
      const isExpanded = expanded.includes(cat.id)
      const FolderIcon = isExpanded ? FolderOpen : Folder

      rows.push(
        <div
            key={cat.id}
            className="group flex items-center gap-2.5 border-b border-sidebar-border px-4 py-2.5 transition-colors last:border-0 hover:bg-sidebar-accent/50"
            style={{ paddingLeft: 16 + depth * 24 }}
          >
          <button
            type="button"
            onClick={() => toggleExpand(cat.id)}
            disabled={!hasChildren}
            className={`flex w-5 shrink-0 items-center justify-center rounded transition-colors ${
              hasChildren ? "text-sidebar-foreground/40 hover:text-sidebar-foreground" : "cursor-default"
            }`}
            title={hasChildren ? (isExpanded ? "Collapse" : "Expand") : undefined}
          >
            {hasChildren ? (
              <ChevronRight className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            ) : (
              <span className="size-1.5 rounded-full bg-sidebar-foreground/30" />
            )}
          </button>

          <FolderIcon className="size-4 shrink-0 text-sidebar-foreground/40" />

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 truncate text-sm font-medium text-sidebar-foreground">
              {cat.name}
              {!cat.isActive && (
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                  Inactive
                </span>
              )}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/40">/{cat.slug}</p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              cat.productCount > 0
                ? "bg-sidebar-accent text-sidebar-foreground/70"
                : "text-sidebar-foreground/40"
            }`}
          >
            {cat.productCount} {cat.productCount === 1 ? "product" : "products"}
          </span>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => openEdit(cat)}
              className="rounded-lg p-1.5 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              title="Edit category"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(cat)}
              className="rounded-lg p-1.5 text-sidebar-foreground/40 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              title="Delete category"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      )

      if (isExpanded && hasChildren && cat.children) {
        rows.push(...renderRows(cat.children, depth + 1))
      }
    }
    return rows
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">Categories</h1>
          <p className="mt-1 text-sm text-sidebar-foreground/60">
            Organize your catalog with nested categories
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      {notice && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-600">
          <Check className="size-4" />
          {notice}
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="ml-auto rounded p-1 hover:bg-emerald-500/10 transition-colors"
            title="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-sidebar-border bg-sidebar">
        <div className="flex flex-col gap-3 border-b border-sidebar-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-sidebar-foreground/50">
            {categories.length} categories · {totalProducts} products
          </p>
          {allExpandableIds.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setExpanded(allExpandableIds)}
                className="rounded-md px-2 py-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                Expand all
              </button>
              <span className="text-sidebar-foreground/30">·</span>
              <button
                type="button"
                onClick={() => setExpanded([])}
                className="rounded-md px-2 py-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                Collapse all
              </button>
            </div>
          )}
        </div>

        {tree.length === 0 ? (
          <div className="p-10 text-center">
            <Folder className="mx-auto size-8 text-sidebar-foreground/30" />
            <p className="mt-3 text-sm font-medium text-sidebar-foreground">No categories yet</p>
            <p className="mt-1 text-sm text-sidebar-foreground/50">Create your first category to get started.</p>
          </div>
        ) : (
          renderRows(tree, 0)
        )}
      </div>

      <CategoryModal
        open={modal !== null}
        mode={modal?.mode ?? "create"}
        initialData={modal?.initial ?? { name: "", slug: "", parentId: null, description: "", isActive: true }}
        parentOptions={parentOptions}
        onClose={() => setModal(null)}
        onSave={handleSaveCategory}
      />

      <DialogPrimitive.Root
          open={deleteTarget !== null}
          onOpenChange={(next) => {
            if (!next) setDeleteTarget(null)
          }}
        >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg transition duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
            {deleteTarget && (
              <>
                <div className="flex items-start gap-3 border-b border-sidebar-border p-5">
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
                      deleteBlocked ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    <AlertTriangle className="size-5" />
                  </span>
                  <div>
                    <DialogPrimitive.Title className="text-lg font-semibold">
                      {deleteBlocked ? "Cannot delete category" : `Delete "${deleteTarget.name}"?`}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-1 text-sm text-sidebar-foreground/60">
                      {deleteBlocked
                        ? deleteBlockMessage
                        : `This will permanently remove "${deleteTarget.name}" and cannot be undone.`}
                    </DialogPrimitive.Description>
                  </div>
                  <DialogPrimitive.Close render={<Button variant="ghost" size="icon-sm" />}>
                    <X />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
                <div className="flex items-center justify-end gap-2 p-5">
                  {deleteBlocked ? (
                    <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                      Close
                    </Button>
                  ) : (
                    <>
                      <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                        Cancel
                      </Button>
                      <Button type="button" variant="destructive" onClick={confirmDelete}>
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
