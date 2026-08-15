# Account — Addresses Page (UI Only)

## Context

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui — use these primitives, imported from `@/components/ui/*`:
  - `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` — for each address card
  - `Button`
  - `Badge` (from `@/components/ui/badge`) — for the "Default" label
  - `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` (from `@/components/ui/dialog`) — for the Add/Edit Address modal
  - `Input`, `Label`
  - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` — for the Type field (Shipping / Billing / Both)
  - `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel` (from `@/components/ui/alert-dialog`) — for delete confirmation
  - Do **NOT** use shadcn's `<Form>` component — static markup only, use plain primitives directly
- **Route:** `/account/addresses`
- **Layout:** Rendered inside the existing `/account` layout (sidebar already built — do not rebuild it)

## IMPORTANT — Scope of This Task

Build **static markup only** — JSX structure and Tailwind/shadcn styling, nothing else:

- ✅ JSX structure using the shadcn primitives listed above, with hardcoded sample content
- ✅ `Dialog`/`AlertDialog` components can be included in the markup in their default (closed) state — these are pre-built shadcn/Radix components with their own internal interactivity, which is expected and fine (see note at the end)
- ❌ Do NOT add `"use client"` in the files you create
- ❌ Do NOT use React hooks (`useState`, `useEffect`, etc.) in the files you create
- ❌ Do NOT write event handlers (`onClick`, `onChange`, `onSubmit`) in the files you create
- ❌ Do NOT write any HTTP requests, data-fetching, or API calls
- ❌ Do NOT accept or wire up props — hardcode sample content (multiple sample addresses) directly in the JSX

This is purely the visual skeleton. All interactivity, state, and API wiring will be added in a separate follow-up task.

## Page Structure

1. Page header: "My Addresses" title + "+ Add New Address" button (opens the Dialog)
2. List of address cards (render 3 hardcoded sample addresses to show the layout with multiple items)
3. Add/Edit Address modal (Dialog) — same modal markup handles both create and edit visually; just build one static version with sample data pre-filled, as if in "edit" mode
4. Delete confirmation (AlertDialog)

## Section 1: Address Card (repeat 3x with different sample data)

Each card should show:

| Element | Notes |
|---|---|
| Label | e.g. "Home" — as a heading |
| "Default" badge | Only shown on one of the three sample cards, to demonstrate the default state |
| Type | e.g. "Shipping" — small text or badge |
| Recipient Name | |
| Phone | |
| Full address | Address Line 1, Address Line 2 (if present), Barangay, City, Province, Postal Code |
| Action buttons | "Edit" (opens Dialog), "Delete" (opens AlertDialog), "Set as Default" (only shown on non-default cards) |

Sample data to use across the 3 cards:

1. **Home** (default) — Juan Dela Cruz, 09171234567, 123 Rizal Street, Unit 4B, Brgy. San Jose, Calamba City, Laguna, 4027
2. **Office** — Juan Dela Cruz, 09179876543, 456 Business Park Ave, Floor 12, Brgy. Bel-Air, Makati City, Metro Manila, 1209
3. **Mom's House** — Maria Dela Cruz, 09201112233, 789 Family Road, Brgy. Poblacion, Los Baños, Laguna, 4030

## Section 2: Add/Edit Address Modal (Dialog)

Build one static version, pre-filled with sample data (representing "edit" mode). Fields:

| Field | Component | Sample Value |
|---|---|---|
| Label | `Input` | "Home" |
| Type | `Select` (Shipping / Billing / Both) | "Shipping" |
| Recipient Name | `Input` | "Juan Dela Cruz" |
| Phone | `Input` | "09171234567" |
| Address Line 1 | `Input` | "123 Rizal Street" |
| Address Line 2 | `Input` | "Unit 4B" |
| Barangay | `Input` | "San Jose" |
| City | `Input` | "Calamba City" |
| Province | `Input` | "Laguna" |
| Region | `Input` | "Region IV-A (CALABARZON)" |
| Postal Code | `Input` | "4027" |
| Country | `Input` | "Philippines" |

- Label field should show helper text below it: "A nickname to help you recognize this address later"
- Modal footer: "Cancel" and "Save Address" buttons (`DialogFooter`)

## Section 3: Delete Confirmation (AlertDialog)

- Title: "Delete this address?"
- Description: "This action cannot be undone. Are you sure you want to delete 'Home'?"
- Footer: "Cancel" and "Delete" (destructive-styled) buttons

## Empty State (Optional but Nice to Include)

Include a simple empty-state markup too (can be commented out or a separate small section at the bottom of the file for reference) — icon/illustration placeholder, "No addresses yet" text, "+ Add Your First Address" button. Not required to be functionally toggled, just visually present as a reference for later wiring.

## Layout Notes

- Cards should be arranged in a responsive grid or stacked list — single column on mobile, comfortable 1-2 column layout on desktop
- Consistent spacing/typography with the rest of the project

## Component Structure Suggestion

```
components/account/
  ├── AddressCard.tsx
  ├── AddressFormDialog.tsx
  └── DeleteAddressDialog.tsx

app/account/addresses/page.tsx   ← composes the above, renders 3 sample AddressCards
```

Each component takes **no props** for this task — self-contained static markup with hardcoded sample content, e.g.:

```tsx
export function AddressCard() {
  return ( /* static markup with hardcoded sample data */ );
}
```

(For the page to show 3 different cards with different data despite `AddressCard` taking no props, either hardcode 3 slightly different inline JSX blocks directly in `page.tsx`, or create `AddressCard`, `AddressCardOffice`, `AddressCardMom` as distinct static components — agent's choice, whichever is cleaner.)

## Note on shadcn Components

`Dialog`, `AlertDialog`, and `Select` are built on Radix UI and have their own internal interactivity/"use client" baked into the shadcn component files themselves — that's expected and fine, since that's pre-built library code, not code being written for this task. The constraint in this spec applies only to the **files being created** (`AddressCard.tsx`, `AddressFormDialog.tsx`, `DeleteAddressDialog.tsx`, `page.tsx`) — those should not add their own `"use client"`, hooks, or handlers beyond simply composing and rendering the shadcn primitives with static content.

## Out of Scope for This Task

- Any props, callbacks, or component inputs
- Any React hooks or event handlers in the created files
- Any real or stubbed API integration
- Functional open/close state wiring for the Dialog/AlertDialog beyond their default shadcn behavior