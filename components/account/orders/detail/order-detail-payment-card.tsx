import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge } from "./order-status-badge"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order"
import { Badge } from "@/components/ui/badge"


type OrderDetailPaymentCardProps = {
  paymentMethod: PaymentMethod,
  paymentStatus: PaymentStatus
  isExpired: boolean
}

export function OrderDetailPaymentCard({ paymentMethod, paymentStatus, isExpired }: OrderDetailPaymentCardProps) {
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
              <dd className="font-medium">{paymentMethod}</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                {
                  isExpired ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : (
                    <Badge variant="outline">{paymentStatus}</Badge>
                  )
                }
              </dd>
            </div>

            {/* <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Payment</dt>
              <dd className="text-muted-foreground">Not paid yet</dd>
            </div> */}
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
