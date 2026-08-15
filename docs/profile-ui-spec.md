# Account — Personal Information Page (UI Only)

## Context

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui — use these primitives, imported from `@/components/ui/*`:
  - `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` (from `@/components/ui/card`) — use for each section
  - `Input` (from `@/components/ui/input`) — text, date, password inputs
  - `Label` (from `@/components/ui/label`)
  - `Button` (from `@/components/ui/button`)
  - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` (from `@/components/ui/select`) — for Gender field
  - `Avatar`, `AvatarImage`, `AvatarFallback` (from `@/components/ui/avatar`)
  - Do **NOT** use shadcn's `<Form>` component (from `@/components/ui/form`) — that wrapper is built on `react-hook-form` and requires hooks. Since this task is static markup only, use the plain primitives above directly (e.g. `<Input>` on its own, not wrapped in `<FormField>`/`<FormControl>`).
- **Route:** `/account/profile`
- **Layout:** Rendered inside the existing `/account` layout (sidebar already built — do not rebuild it)

## IMPORTANT — Scope of This Task

Build **static markup only** — JSX structure and Tailwind styling, nothing else. This means:

- ✅ JSX structure and Tailwind classes only
- ✅ Plain HTML form elements (`<input>`, `<select>`, `<button>`, etc.) with hardcoded placeholder/sample values where content is needed (e.g. `value="Juan"` or `placeholder="First name"`)
- ❌ Do NOT use `"use client"` — these are static Server Components with no interactivity
- ❌ Do NOT use ANY React hooks — no `useState`, `useEffect`, `useRef`, nothing
- ❌ Do NOT write event handlers (no `onClick`, `onChange`, `onSubmit` logic) — inputs can be plain uncontrolled elements
- ❌ Do NOT write any HTTP requests, data-fetching, or API calls
- ❌ Do NOT accept or wire up props for callbacks or dynamic data — hardcode sample content directly in the JSX for now

This is purely the visual skeleton. All interactivity, state, props, and API wiring will be added in a completely separate pass later — do not anticipate or scaffold for it now.

## Page Structure

Two sections on this page:

1. Avatar / Profile Picture
2. Personal Information Form
3. Change Password Form (separate card/section, same page)

---

## Section 1: Avatar

- Circular image preview (use a placeholder image URL or initials-style fallback markup)
- "Change Photo" button — plain `<button>`, no click handler
- Static `<input type="file" accept="image/*" />` present in the markup (styled/hidden as needed), no logic attached
- Optional: "Remove Photo" text link/button — plain markup, no handler

## Section 2: Personal Information Form

| Field | Input Type | Required | Notes |
|---|---|---|---|
| First Name | text | Yes | |
| Last Name | text | Yes | |
| Phone | text | Yes | |
| Date of Birth | date picker | No | |
| Gender | select (Male / Female / Other) | No | |
| Email | text, read-only/disabled | — | Display only, not editable on this form |

- "Save Changes" button at the bottom of this section — plain `<button>`, no click/submit handler
- Fields use hardcoded sample `value`/`defaultValue` attributes (e.g. `defaultValue="Juan"`) so the form looks populated — no controlled state

## Section 3: Change Password Form

| Field | Input Type | Required |
|---|---|---|
| Current Password | password input | Yes |
| New Password | password input | Yes |
| Confirm New Password | password input | Yes |

- "Update Password" button — plain `<button>`, no click/submit handler
- Include a static "show password" icon/button in the markup if desired, but no toggle logic behind it (visual only)

## Layout Notes

- Each section (Avatar, Personal Info, Change Password) should be its own visually distinct card (rounded corners, subtle border or shadow, padding — consistent with the rest of the admin/account UI already built)
- Responsive: stack sections vertically on mobile, comfortable max-width on desktop (form shouldn't stretch full-width on large screens — cap around `max-w-2xl` or similar)
- Use consistent spacing/typography with the rest of the project (match existing Tailwind patterns already used in the admin pages if available for reference)

## Component Structure Suggestion

```
components/account/
  ├── ProfileAvatarCard.tsx
  ├── PersonalInfoForm.tsx
  └── ChangePasswordForm.tsx

app/account/profile/page.tsx   ← composes the above three components
```

Each component takes **no props at all** for this task — just self-contained static markup with hardcoded sample content. Component function signatures should take no arguments, e.g.:

```tsx
export function ProfileAvatarCard() {
  return ( /* markup with hardcoded sample content */ );
}
```

## Out of Scope for This Task

- Any props, callbacks, or component inputs of any kind
- Any React hooks (`useState`, `useEffect`, or otherwise)
- Any event handlers (`onClick`, `onChange`, `onSubmit`)
- Any real or stubbed API integration
- Any client-side interactivity whatsoever — this is static markup only

This will all be added in a completely separate follow-up task, once the visual structure is approved.

## Note on shadcn Components

Some shadcn primitives (like `Select`) are internally built on Radix UI and have their own internal interactivity/"use client" baked in — that's expected and fine, since that's pre-built library code, not code the agent is writing. The constraint in this spec applies to the **files the agent creates** (`ProfileAvatarCard.tsx`, `PersonalInfoForm.tsx`, `ChangePasswordForm.tsx`, `page.tsx`) — those should not add their own `"use client"`, hooks, or handlers on top of what the imported shadcn components already do internally. Just compose the primitives with static/hardcoded content and no additional wiring.