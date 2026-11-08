import { Card, CardContent } from "@/components/ui/card"

export function PaymentReceivedBanner() {
  return (
    <section aria-labelledby="payment-received-heading">
      <Card>
        <CardContent>
          <h2
            id="payment-received-heading"
            className="text-base font-semibold"
          >
            Payment received
          </h2>
          <p className="text-sm text-muted-foreground">
            Thanks! We&apos;re getting your order ready.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
