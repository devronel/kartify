import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toReadableDateWithTime } from "@/lib/helper"
import { OrderStatus, OrderStatusHistoryResponse } from "@/types/order"

type OrderDetailTimelineProps = {
  timelines: OrderStatusHistoryResponse[]
}


const timelineLable: Record<OrderStatus, string> = {
  "PENDING": "Order Placed",
  "PAID": "Payment Confirmed",
  "PROCESSING": "Preparing Your Order",
  "SHIPPED": "On the Way",
  "DELIVERED": "Delivered",
  "CANCELLED": "Order Cancelled"
}

export function OrderDetailTimeline({ timelines }: OrderDetailTimelineProps) {
  return (
    <section aria-labelledby="order-timeline-heading">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="order-timeline-heading">Timeline</h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ol>
            {
              timelines.map(timeline => (
                <li key={timeline.createdAt} className="group flex gap-3 pb-6 last:pb-0">
                  <div className="relative flex w-2.5 shrink-0 justify-center">
                    <span
                      className="mt-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute top-4 bottom-0 w-px bg-border group-last:hidden"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="-mt-0.5">
                    <p className="text-sm font-medium">{timelineLable[timeline.status]}</p>
                    <p className="text-xs text-muted-foreground">
                      {/* <time dateTime="2026-10-25T10:42">Oct 25, 2026, 10:42 AM</time> */}
                      <time dateTime="2026-10-25T10:42">{toReadableDateWithTime(timeline.createdAt)}</time>
                    </p>
                  </div>
                </li>
              ))
            }
          </ol>
        </CardContent>
      </Card>
    </section>
  )
}

