import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function OrderCancelledBanner() {
  return (
    <section aria-labelledby="order-cancelled-heading">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-1">
            <h2
              id="order-cancelled-heading"
              className="text-base font-semibold"
            >
              Order cancelled
            </h2>
            <p className="text-sm text-muted-foreground">
              This order was cancelled and you were not charged.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Continue shopping
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
