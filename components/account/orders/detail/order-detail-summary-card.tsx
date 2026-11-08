import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderDetailSummaryCard() {
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
              {/* TODO(logic): format money */}
              <dd>₱3,196.50</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>Free</dd>
            </div>

            {/* TODO(logic): show the discount row only when the order has one */}

            <div className="flex items-center justify-between gap-3 border-t pt-3">
              <dt className="font-semibold">Total</dt>
              {/* TODO(logic): format money */}
              <dd className="text-base font-semibold">₱3,196.50</dd>
            </div>
          </dl>

          {/* TODO(logic): show the order note only when it exists */}
        </CardContent>
      </Card>
    </section>
  )
}
