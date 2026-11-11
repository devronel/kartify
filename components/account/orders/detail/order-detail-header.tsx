import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"
import { toReadableDate } from "@/lib/helper"
import { OrderStatus } from "@/types/order"
import { Badge } from "@/components/ui/badge"

type OrderDetailHeaderProps = {
  orderNumber: string,
  createdAt: string,
  orderStatus: OrderStatus
  isExpired: boolean
}

export function OrderDetailHeader({ orderNumber, createdAt, orderStatus, isExpired }: OrderDetailHeaderProps) {
  return (
    <header className="space-y-4">
      <Link
        href="/account/orders"
        className="-ml-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        My orders
      </Link>

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">
            Order { orderNumber }
          </h1>
          {
            isExpired ? (
              <Badge variant="destructive">Expired</Badge>
            ) : (
              <OrderStatusBadge status={orderStatus} />
            )
          }
        </div>

        <p className="text-sm text-muted-foreground">Placed { toReadableDate(createdAt) }</p>
      </div>
    </header>
  )
}
