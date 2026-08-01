# Admin — Categories Page Spec

## Context

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Route:** `/admin/categories`
- **Purpose:** List all categories in a nested tree view, with create/edit handled via a modal (not a separate page, since the form is short)

## Layout

### List Page (`/admin/categories`)

- Header row: page title "Categories" + `[+ Add Category]` button (opens modal in create mode)
- Tree-style list, indented by nesting level (categories are nested via `parent_id`)
- Each row shows: category name, expand/collapse control if it has children, `[Edit]` and `[Delete]` actions
- Optional (nice-to-have, not required v1): drag handle to reorder (`sort_order`)

Example structure:
```
▸ Clothing                    [Edit] [Delete]
  ▸ Men                       [Edit] [Delete]
    • Shirts                  [Edit] [Delete]
    • Pants                   [Edit] [Delete]
  ▸ Women                     [Edit] [Delete]
▸ Electronics                 [Edit] [Delete]
  • Phones                    [Edit] [Delete]
```

### Modal — Create / Edit Category

Single modal component handles both modes:
- **Create mode:** triggered by `[+ Add Category]`, empty form
- **Edit mode:** triggered by `[Edit]` on a row, pre-filled with that category's data (pass `categoryId`, fetch/prefill on open)

| Field | Input Type | Required | Notes |
|---|---|---|---|
| Name | text | Yes | |
| Slug | text | Yes | Auto-generate from name, editable |
| Parent Category | dropdown (nested, indented options) | No | Include a "None — top level" option |
| Description | textarea | No | |
| Image | single file upload | No | Thumbnail preview after select |
| Is Active | toggle | Yes | Default: true |

Modal footer: `[Cancel]` and `[Save]` buttons.

### Delete Confirmation

- Clicking `[Delete]` opens a small confirmation dialog, not an instant delete
- **Business rule:** deletion is blocked if the category has any products (`products.category_id`) or subcategories (`categories.parent_id`) referencing it
  - If blocked: show message, e.g. *"Cannot delete: this category has 3 products and 1 subcategory. Reassign or remove them first."*
  - If clear: show standard confirm dialog *"Are you sure you want to delete '{name}'?"* → proceed on confirm
- This check must be enforced on the backend (Spring Boot service layer), not just the frontend, since the frontend check alone isn't a reliable guard

## State Management Notes

- Use React state for the tree list and modal open/close + form state
- No browser storage (localStorage/sessionStorage not supported in this environment) — keep everything in memory / component state for now, backend not yet connected
- Consider a shared `CategoryModal` component reusable both here and as a quick "+ Add new category" shortcut from the product creation page's category dropdown (optional future enhancement)

## Data Shape Reference (for eventual API integration)

```ts
interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description?: string;
  image?: string; // URL after upload
  isActive: boolean;
  sortOrder: number;
  productCount?: number; // for delete-block check display
  children?: Category[]; // nested, for tree rendering
}

interface CategoryFormData {
  name: string;
  slug: string;
  parentId: number | null;
  description?: string;
  image?: File;
  isActive: boolean;
}
```

## Out of Scope

- Drag-and-drop reordering (nice-to-have, not required v1)
- Bulk actions (bulk delete/activate) — not required v1