import { useState } from "react"
import { Check, ChevronDown, FolderTree, Search } from "lucide-react"
import { CategoryNode } from "@/types/admin/product"
import FieldError from "../shared/FieldError"

type FlatCategory = {
  id: number
  name: string
  path: string
  depth: number
}

function flattenCategories(
  nodes: CategoryNode[],
  depth = 0,
  prefix: string[] = [],
  out: FlatCategory[] = []
): FlatCategory[] {
  for (const node of nodes) {
    const next = [...prefix, node.name]
    out.push({ id: node.id, name: node.name, path: next.join(" > "), depth })
    if (node.children) flattenCategories(node.children, depth + 1, next, out)
  }
  return out
}

const inputClass = "w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors"
const errorInputClass = "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"

export default function CategorySelect({
  value,
  onChange,
  error,
  categories
}: {
  value: number | null
  onChange: (id: number) => void
  error?: string,
  categories: CategoryNode[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selected = flattenCategories(categories).find((c) => c.id === value)

  const filtered = flattenCategories(categories).filter((c) => {
    const q = search.toLowerCase()
    return (
      !q || c.name.toLowerCase().includes(q) || c.path.toLowerCase().includes(q)
    )
  })

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 text-left ${inputClass} ${error ? errorInputClass : ""}`}
      >
        <span className={selected ? "text-sidebar-foreground" : "text-sidebar-foreground/40"}>
          {selected ? selected.path : "Select a category"}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-sidebar-foreground/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {error && <FieldError message={error} />}

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
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-sidebar-foreground/40">
                  No categories match your search
                </li>
              )}
              {filtered.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(category.id)
                      setOpen(false)
                      setSearch("")
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                    style={{ paddingLeft: 8 + category.depth * 16 }}
                  >
                    <FolderTree className="size-4 shrink-0 text-sidebar-foreground/40" />
                    <span className="truncate">{category.name}</span>
                    {value === category.id && <Check className="ml-auto size-4 shrink-0 text-primary" />}
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