import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function OrderDetailBanner() {
  return (
    <section aria-labelledby="order-banner-heading">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-1">
            <h2 id="order-banner-heading" className="text-base font-semibold">
              Waiting for payment
            </h2>
            {/* TODO(logic): countdown and expired check from expiresAt */}
            <p className="text-sm text-muted-foreground">
              Pay within 24 min to keep your order.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {/* TODO(logic): Pay now click and redirect */}
            <Button className="w-full sm:w-auto">Pay now</Button>
            <p className="text-xs text-muted-foreground">
              Already paid? This page updates automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
