import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PaymentExpiredBanner() {
  return (
    <section aria-labelledby="payment-expired-heading">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-1">
            <h2
              id="payment-expired-heading"
              className="text-base font-semibold"
            >
              Payment time ended
            </h2>
            <p className="text-sm text-muted-foreground">
              This order can no longer be paid and your items were released.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            Continue shopping
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
