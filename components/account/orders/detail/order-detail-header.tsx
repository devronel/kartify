import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"

export function OrderDetailHeader() {
  return (
    <header className="space-y-4">
      <Link
        href="/profile/orders"
        className="-ml-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        My orders
      </Link>

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">
            Order ORD-2026-8D20A2B6647C
          </h1>
          <OrderStatusBadge />
        </div>

        {/* TODO(logic): format the placed date */}
        <p className="text-sm text-muted-foreground">Placed Oct 25, 2026</p>
      </div>
    </header>
  )
}
