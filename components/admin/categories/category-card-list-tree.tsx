"use client"

import React, { useState } from "react"
import { ChevronRight, FolderIcon, FolderOpen, Pencil, Trash2 } from "lucide-react"
import { CategoryTree } from "@/types/admin/category"

type CategoryCardListTreeProps = {
    nodes: CategoryTree[],
    level: number,
    onUpdate: (id: number) => Promise<void>
}

export default function CategoryCardListTree({ nodes, level = 0, onUpdate } : CategoryCardListTreeProps){

    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }

            return next
        })
    }

    return (
        <>
            {nodes.map(category => {
                const isExpanded = expandedIds.has(category.id)
                const hasChildren = category.children.length > 0

                return (
                    <React.Fragment key={category.id}>
                        <div
                            className="group flex items-center gap-2.5 border-b border-sidebar-border px-4 py-2.5 transition-colors last:border-0 hover:bg-sidebar-accent/50"
                            style={{ paddingLeft: `${16 + level * 16}px` }}
                        >
                            {
                                hasChildren ? (
                                    <button
                                        onClick={() => toggleExpand(category.id)}
                                        type="button"
                                        className="flex w-5 shrink-0 items-center justify-center rounded transition-colors"
                                    >
                                        <ChevronRight
                                            className={`size-4 transition-transform ${ isExpanded ? "rotate-90" : "" }`}
                                        />
                                    </button>
                                ) : (
                                    <div className="w-5 shrink-0" />
                                )
                            }

                            {
                                isExpanded ? <FolderOpen className="size-4 shrink-0 text-sidebar-foreground/40" /> : <FolderIcon className="size-4 shrink-0 text-sidebar-foreground/40" />
                            }

                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 truncate text-sm font-medium text-sidebar-foreground">
                                    {category.name}

                                    {!category.isActive && (
                                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                                            Inactive
                                        </span>
                                    )}
                                </p>

                                <p className="truncate text-xs text-sidebar-foreground/40">
                                    /{category.slug}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                    category.productCount > 0
                                        ? "bg-sidebar-accent text-sidebar-foreground/70"
                                        : "text-sidebar-foreground/40"
                                }`}
                            >
                                {category.productCount} { category.productCount > 0 ? 'products' : 'product' }
                            </span>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() => onUpdate(category.id)}
                                    type="button"
                                    className="rounded-lg p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    title="Edit category"
                                >
                                    <Pencil className="size-4" />
                                </button>

                                <button
                                    type="button"
                                    className="rounded-lg p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-red-500/10 hover:text-red-500"
                                    title="Delete category"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Render children only when expanded */}
                        {hasChildren && isExpanded && (
                            <CategoryCardListTree
                                nodes={category.children}
                                level={level + 1}
                                onUpdate={onUpdate}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </>
    )
}