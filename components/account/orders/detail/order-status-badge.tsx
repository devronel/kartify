import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/types/order"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  
  switch (status) {
    case "PAID":
      return <Badge>{status}</Badge>
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        >
          Waiting for payment
        </Badge>
      )
    case "PROCESSING":
    case "DELIVERED":
      return <Badge variant="secondary">{status}</Badge>
    case "CANCELLED":
      return <Badge variant="secondary" className="text-muted-foreground">{status}</Badge>
    case "SHIPPED":
      return  <Badge variant="outline">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }

}
