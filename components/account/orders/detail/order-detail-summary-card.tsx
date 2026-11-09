import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { moneyFormat } from "@/lib/helper"

type OrderDetailsSummaryCardProps = {
  subtotal: number,
  total: number
}

export function OrderDetailSummaryCard({ subtotal, total } : OrderDetailsSummaryCardProps) {
  return (
    <section aria-labelledby="order-summary-heading">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="order-summary-heading">Summary</h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>&#8369;{moneyFormat.format(subtotal)}</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>Free</dd>
            </div>

            {/* TODO(logic): show the discount row only when the order has one */}

            <div className="flex items-center justify-between gap-3 border-t pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="text-base font-semibold">&#8369;{moneyFormat.format(total)}</dd>
            </div>
          </dl>

          {/* TODO(logic): show the order note only when it exists */}
        </CardContent>
      </Card>
    </section>
  )
}
