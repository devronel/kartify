import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

export default function OrderCardListComponent(){
  return (
    <ul className="space-y-4">
      {/* Pending */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-8D20A2B6647C"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-8D20A2B6647C
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 25, 2026
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                >
                  Waiting for payment
                </Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  {/* TODO(logic): replace with the real product thumbnail */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Kape Barako Whole Beans 500g
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Ceramic Pour-Over Dripper
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Bamboo Coffee Scoop
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  3 items
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱1,249.50
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {/* TODO(logic): Pay now click */}
                <Button className="w-full">Pay now</Button>
                <Button variant="outline" className="w-full">
                  View order
                </Button>
                {/* TODO(logic): countdown */}
                <p className="text-center text-xs text-muted-foreground">
                  Pay within 24 min
                </p>
              </div>
            </div>
          </div>
        </article>
      </li>

      {/* Pending, payment expired */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-71C4E9A03B2D"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-71C4E9A03B2D
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 24, 2026
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                >
                  Waiting for payment
                </Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Woven Pandan Basket
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Pili Nut Candy Pack
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  2 items
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱899.00
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full" disabled>
                  Pay now
                </Button>
                <Button variant="outline" className="w-full">
                  View order
                </Button>
                <p className="text-center text-xs font-medium text-muted-foreground">
                  Payment time ended
                </p>
              </div>
            </div>
          </div>
        </article>
      </li>

      {/* Paid */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-5A9F2C7D8E31"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-5A9F2C7D8E31
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 22, 2026
                  </p>
                </div>
                <Badge>Paid</Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Handwoven Abaca Tote Bag
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  1 item
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱2,480.00
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  View order
                </Button>
              </div>
            </div>
          </div>
        </article>
      </li>

      {/* Processing */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-3B6E1F0A9C58"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-3B6E1F0A9C58
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 20, 2026
                  </p>
                </div>
                <Badge variant="secondary">Preparing</Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Barong Tagalog Cotton Shirt
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Rattan Serving Tray
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Philippine Arabica Coffee 1kg
                  </span>
                </li>
                <li className="pl-13 text-xs text-muted-foreground">
                  +2 more items
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  5 items
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱3,795.00
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  View order
                </Button>
              </div>
            </div>
          </div>
        </article>
      </li>

      {/* Shipped */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-9F2D4B7C1A60"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-9F2D4B7C1A60
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 18, 2026
                  </p>
                </div>
                <Badge variant="outline">Shipped</Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Ilocos Inabel Blanket
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Mother-of-Pearl Coaster Set
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  2 items
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱1,650.50
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  View order
                </Button>
              </div>
            </div>
          </div>
        </article>
      </li>

      {/* Delivered */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-2C8A5E3D7B94"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-2C8A5E3D7B94
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 12, 2026
                  </p>
                </div>
                <Badge variant="secondary">Delivered</Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Batangas Batik Apron
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Bamboo Coffee Scoop
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Kape Barako Whole Beans 500g
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  3 items
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱4,320.00
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  View order
                </Button>
              </div>
            </div>
          </div>
        </article>
      </li>

      {/* Cancelled */}
      <li>
        <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href="/profile/orders/ORD-2026-6D1B8A4F2E35"
                    className="font-medium text-foreground hover:underline"
                  >
                    ORD-2026-6D1B8A4F2E35
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Oct 8, 2026
                  </p>
                </div>
                <Badge variant="secondary" className="text-muted-foreground">
                  Cancelled
                </Badge>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="truncate text-foreground">
                    Pili Nut Candy Pack
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                <span className="text-xs text-muted-foreground">
                  1 item
                </span>
                <span className="text-base font-semibold text-foreground">
                  ₱749.00
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  View order
                </Button>
              </div>
            </div>
          </div>
        </article>
      </li>
    </ul>
  )
}