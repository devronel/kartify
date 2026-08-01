# Admin — Create Product Page Spec

## Context

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Route:** `/admin/products/create`
- **Purpose:** Allow an admin to create a new product, including images and variants (size/color combinations)

## Layout

Single page, **not** a multi-step wizard. Organize into sectioned cards on one scrollable page, in this order:

1. Basic Info
2. Images
3. Pricing
4. Inventory / Variants
5. Sticky "Save Product" button (fixed at bottom or top, always visible while scrolling)

Reference UX pattern: Shopify's "Add product" page (single long page, sectioned cards).

---

## Section 1: Basic Info

| Field | Input Type | Required | Notes |
|---|---|---|---|
| Product Name | text | Yes | |
| Slug | text | Yes | Auto-generate from name (kebab-case), editable, read-only by default until "Edit" clicked |
| Category | searchable select/dropdown | Yes | Nested categories — render as indented tree (e.g. "Clothing > Men > Shirts") |
| Short Description | text | No | Used on listing/grid cards |
| Description | rich text or textarea | No | Full product detail page description |
| SKU | text | No | Base product SKU (only relevant if no variants) |

## Section 2: Images

- Multi-file drag-and-drop upload area
- Show thumbnail previews in a reorderable grid (drag handle to reorder → maps to `sort_order`)
- Each thumbnail has a "Set as primary" action (star icon) → maps to `is_primary`
- Support removing an image before save
- Accept: jpg, png, webp. Show file size limit if applicable.

## Section 3: Pricing

| Field | Input Type | Required | Notes |
|---|---|---|---|
| Base Price | number (currency) | Yes | Also used as "starting at" price if product has variants |
| Compare Price | number (currency) | No | Shown as strikethrough original price when set |
| Cost Price | number (currency) | No | Admin-only, for internal profit tracking, not shown to customers |
| Weight | number (kg or g, specify unit) | No | For shipping calculation |

## Section 4: Inventory / Variants

**Toggle:** `Has Variants?` (on/off switch)

### If OFF (simple product):
- Show single field: **Stock Quantity** (number, required)

### If ON (has variants):
Two-step UI:

**Step A — Attribute Selection**
- List existing attributes (e.g. "Size", "Color") as checkboxes
- Under each attribute, show its existing values as sub-checkboxes (e.g. Size → Small, Medium, Large)
- Allow inline "+ Add new value" per attribute (e.g. add "XL" under Size without leaving the page)
- Allow "+ Add new attribute" if admin needs a type not yet in the system (e.g. "Material")

**Step B — Auto-Generated Variant Table**
- Once attributes/values are selected, generate all possible combinations automatically (cartesian product)
- Render as an editable table:

| Variant (auto-label) | SKU | Price Override | Stock | Image | Active |
|---|---|---|---|---|---|
| Red / Small | text input | number input (optional, blank = inherit base price) | number input | small upload/thumbnail | toggle |

- Regenerating attribute selections should regenerate the table (warn if it would remove rows with data already entered)
- Allow bulk-edit actions if feasible (e.g. "set stock for all rows")

---

## State Management Notes

- Use React state (`useState`/`useReducer`) to hold the full form object — no browser storage (localStorage/sessionStorage not supported in this environment)
- Variant table should be derived state: recompute variant combinations when selected attribute values change, but preserve already-entered data per combination where possible (key by a stable identifier like `attributeValueIds.sort().join('-')`)
- Form should support "Save as Draft" (is_active = false) vs "Publish" (is_active = true) if feasible — optional enhancement, not required for v1

## Validation Rules

- Product Name, Slug, Category: required before save
- If `has_variants = false`: Stock Quantity required
- If `has_variants = true`: at least one attribute value must be selected per chosen attribute, and every generated variant row should have Stock filled before save (SKU/price override optional)
- Price fields: must be positive numbers, 2 decimal places

## Data Shape Reference (for eventual API integration)

```ts
interface ProductFormData {
  name: string;
  slug: string;
  categoryId: number;
  shortDescription?: string;
  description?: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  hasVariants: boolean;
  stockQuantity?: number; // only if hasVariants = false
  isActive: boolean;
  isFeatured: boolean;
  images: {
    file: File;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  variants?: {
    attributeValueIds: number[];
    sku?: string;
    price?: number; // override
    stockQuantity: number;
    image?: File;
    isActive: boolean;
  }[];
}
```