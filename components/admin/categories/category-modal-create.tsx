"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Category } from "@/types/admin/category"
import { Check, Plus} from "lucide-react"
import React, { useState } from "react"
import SelectCategory from "./category-select"

type CategoryDataTypes = {
    name: string,
    parentId: number | null,
    description: string,
    isActive: boolean
}

export default function CategoryModalCreate() {

    const [category, setCategory] = useState<CategoryDataTypes>({
        name: '',
        parentId: null,
        description: '',
        isActive: true
    })

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setCategory(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const selectedCategories = (category: Category) => {
        if(category){
            setCategory(prev => ({
                ...prev,
                parentId: category.id
            }))
        }
    }

    const save = () => {
        console.log(category)
    }

    return (
        <>
            <Dialog>
                <DialogTrigger render={
                        <Button>
                            <Plus className="size-4" />
                            Add Category
                        </Button>
                    }>
                    Open
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Add Category
                        </DialogTitle>
                        <DialogDescription className="mt-0.5 text-sm text-sidebar-foreground/60">
                            Create a new category and nest it under a parent if needed
                        </DialogDescription>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="CategoryName">
                            Name
                            <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                            id="CategoryName"
                            name="name"
                            type="text"
                            value={category.name}
                            onChange={handleOnChange}
                            placeholder="e.g. Shirts"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="parentCategory">
                            Parent Category<span className="italic font-light">(optional)</span>
                        </FieldLabel>
                        <SelectCategory 
                            onSelected={selectedCategories}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea 
                            id="description"
                            name="description"
                            value={category.description}
                            onChange={handleOnChange}
                        />
                    </Field>

                    <Field>
                        <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-sidebar-foreground">Active</p>
                                <p className="text-xs text-sidebar-foreground/50">
                                Inactive categories are hidden from customers
                                </p>
                            </div>
                            <Switch 
                                checked={category.isActive}
                                onCheckedChange={value => setCategory(prev => ({ ...prev, isActive: value }))}
                            />
                        </div>
                    </Field>

                    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sidebar-border py-3">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={save} type="button">
                            <Check className="size-4" />
                            Save
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}