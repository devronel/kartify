import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PaymentErrorBanner() {
  return (
    <section aria-labelledby="payment-error-heading">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-1">
            <h2 id="payment-error-heading" className="text-base font-semibold">
              We couldn&apos;t start your payment
            </h2>
            <p className="text-sm text-muted-foreground">
              Your order is saved. Try again to get a new payment link.
            </p>
          </div>

          {/* TODO(logic): retry the payment and redirect to the new link */}
          <Button className="w-full sm:w-auto">Pay now</Button>
        </CardContent>
      </Card>
    </section>
  )
}
