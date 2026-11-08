import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge } from "./order-status-badge"

export function OrderDetailPaymentCard() {
  return (
    <section aria-labelledby="order-payment-heading">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="order-payment-heading">Payment</h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Method</dt>
              <dd className="font-medium">QR Ph</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <OrderStatusBadge />
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Payment</dt>
              <dd className="text-muted-foreground">Not paid yet</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
