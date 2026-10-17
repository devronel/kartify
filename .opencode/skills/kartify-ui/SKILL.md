---
name: kartify-ui
description: Build the visual UI (JSX, Tailwind CSS, shadcn/ui) for Kartify, a Next.js e-commerce project. Use this whenever the user asks to design, build, create, restyle, or improve any page, section, or component for the storefront, cart, checkout, account, or admin areas, even if they only say "make the page" or "build the UI for X". This skill produces UI markup only. It never writes data fetching, state, hooks, event handlers, or business logic, because the user writes all of that themselves.
---

# Kartify UI Skill

You build the visual layer of Kartify: layout, styling, spacing, and states. The user writes every function, hook, request, and piece of logic. Your job is to hand them clean, good-looking markup they can wire up.

Keeping to this boundary matters because the user is using this project to learn how to write the logic. If you add state or requests "to be helpful," they have to read and undo your guesses, and they lose the part they wanted to do themselves.

## Project Context

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, with the shadcn/ui component library and `lucide-react` icons
- **Product:** a single-brand online store. Customers browse, add to cart, check out, and pay online (GCash, Maya). An admin manages products, categories, and orders.
- **Market:** the Philippines. Use `₱` for prices, Philippine names and addresses in sample data, and the address fields region, province, city, barangay, and postal code.
- **Backend:** a separate Spring Boot API. You never touch it or call it.

## The Boundary: What You Do and Don't Write

**You write:**
- JSX structure and Tailwind classes
- Layout, responsive behavior, spacing, typography, color via theme tokens
- Every visual state the page needs (see "States to Design")
- Plain HTML elements and shadcn primitives with hardcoded sample content

**You never write, in any file you create:**
- React hooks (`useState`, `useEffect`, `useRef`, and so on)
- The `"use client"` directive
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- `fetch`, `axios`, or any request or data loading
- Props, callbacks, or context. Hardcode sample content directly in the JSX.
- shadcn's `<Form>` component or anything from `react-hook-form`. It requires hooks. Use the plain primitives (`Input`, `Label`, `Button`, `Select`, and so on).

**Interactive shadcn components are fine.** `Dialog`, `Select`, `DropdownMenu`, `Sheet`, and similar have their own interactivity built into the library. Composing them with static content is not "writing logic."

**Mark where logic goes.** At each spot the user will need to wire something, leave a short comment: `{/* TODO(logic): submit form */}`, `{/* TODO(logic): quantity change */}`. These are the user's to-do list, so keep them specific and few.

If the user explicitly asks for props or interactivity in a particular request, follow that request for that task only.

## Before You Write Anything

1. **Read the existing components** in the project (`components/`, `app/`) and match their patterns, class conventions, and spacing. Consistency beats your preferences.
2. **Check which shadcn components exist** in `components/ui/`. If you need one that isn't installed, don't assume it. List the install command at the end (for example `npx shadcn add dialog alert-dialog badge select`) and use the standard import paths.
3. **Read the user's spec or description fully.** If it names fields, states, or layout, follow it exactly.

## Design Principles

**Use theme tokens, not raw colors.** Use `bg-background`, `text-foreground`, `text-muted-foreground`, `border`, `bg-card`, `text-destructive`, `bg-primary`, and so on. Don't hardcode hex values or arbitrary colors like `text-[#ff0000]`. Tokens make dark mode and re-theming work automatically. The one exception is a warning color (`text-amber-600`) when no token fits.

**Build mobile first.** Write the base classes for small screens, then add `sm:`, `md:`, `lg:` for larger ones. Test the layout mentally at about 375px wide and at desktop width. Wide content (tables) scrolls inside its own container, never the whole page.

**Create hierarchy with size and weight, not decoration.** One clear page title (`text-2xl font-semibold` or similar), muted secondary text, and consistent section spacing. Avoid heavy borders, gradients, and shadows unless the existing UI uses them.

**Use a consistent spacing scale.** Stay on Tailwind's scale (`gap-2`, `gap-4`, `gap-6`, `p-4`, `p-6`). Keep related elements close and separate sections clearly. Page content generally sits in a centered container with a sensible max width (`max-w-6xl` for storefront pages, `max-w-2xl` for forms).

**Keep one primary action per area.** One filled `Button` per card or section, with secondary actions as `variant="outline"` or `variant="ghost"`, and destructive actions as `variant="destructive"`.

**Cards group related content.** Use `Card` with `CardHeader`, `CardContent`, and `CardFooter` for forms and summaries.

## States to Design

Every page should show the states it needs, not just the happy path. Include these as static variations, clearly separated or commented, so the user can switch between them when wiring logic:

| State | What to build |
|---|---|
| Loading | Skeleton placeholders (`Skeleton`) that match the real layout, so nothing jumps |
| Empty | An icon, a short heading, one sentence, and one action button |
| Error | A short message near the thing that failed, in `text-destructive` |
| Disabled | Muted styling, with a visible reason when it isn't obvious |
| Field error | Red border and a small message under the input |
| Unavailable item | A muted row with a clear label such as "Out of stock" or "Only 3 left" |

## Copy and Content

- Use sentence case for headings, buttons, and labels ("Proceed to checkout" and "Add to cart" are both fine). Be consistent across the project.
- Write short, specific labels. Say "Add address," not "Click here to add a new address."
- Make plurals correct. Prefer wording that avoids the problem ("Only 3 left," "3 items in your cart") and use the singular form for 1.
- Don't show a shipping fee as ₱0 before it's known. Say "Calculated at checkout."
- Use realistic sample data: product names, `₱1,299.00` formatting, names like "Juan Dela Cruz," addresses like "123 Rizal Street, Brgy. San Jose, Calamba City, Laguna 4027."

## Icons

- Import from `lucide-react`. Use `size-4` inside buttons with `gap-2`, and larger sizes for empty states.
- Pair an icon with a text label on important actions. Icon-only buttons need `aria-label`.
- Mark decorative icons `aria-hidden="true"`.
- Common choices: `ShoppingCart` (header cart), `ArrowRight` (continue), `Lock` (secure payment), `Trash2` (remove), `Pencil` (edit), `Plus` and `Minus` (quantity), `MapPin` (address).

## Accessibility

- Use semantic elements: `<main>`, `<nav>`, `<section>`, `<form>`, `<button>`, `<ul>`/`<li>` for lists.
- One `<h1>` per page, then `<h2>` and `<h3>` in order. Style headings with classes, don't skip levels for looks.
- Every input has a `Label` connected with `htmlFor` and `id`.
- Keep visible focus styles (shadcn provides them, so don't remove them).
- Ensure text has enough contrast against its background.
- Give images meaningful `alt` text. Use an empty `alt=""` for purely decorative ones.

## File Structure

- Pages in `app/.../page.tsx` stay thin: they compose components and set `metadata` if relevant. They are Server Components, with no `"use client"`.
- Components go in `components/<area>/` (for example `components/cart/`, `components/account/`, `components/admin/`) with one component per file and PascalCase names.
- Use named exports for components, a default export for pages.
- Use `next/image` for images and `next/link` for navigation, not raw `<img>` and `<a>` (except in email templates).
- Keep each component focused. If a file grows past about 150 lines, split it.

## Admin UI Notes

Admin pages favor density and clarity over decoration: tables for lists, compact forms, clear row actions (edit, delete), status badges (`Badge`), and confirmation dialogs (`AlertDialog`) for destructive actions. Lists that can grow get a table with a toolbar (search, filters) above and pagination controls below, all static for now.

## Finishing a Task

Before you hand back, check:

1. No hooks, no `"use client"`, no handlers, no requests, no props in the files you created.
2. All colors come from theme tokens, and the layout works at mobile and desktop widths.
3. Loading, empty, error, and disabled states are present where they apply.
4. Every input has a label, and every icon-only button has an `aria-label`.
5. Sample data is realistic and uses `₱` formatting.

Then report:
- the files you created or changed
- any shadcn components the user needs to install (with the exact `npx shadcn add ...` command)
- the list of `TODO(logic)` spots, so the user knows exactly what to wire up

Keep the report short. The user reads the code, not an essay.