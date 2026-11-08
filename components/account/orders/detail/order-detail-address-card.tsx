import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderDetailAddressCard() {
  return (
    <section aria-labelledby="order-address-heading">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="order-address-heading">Shipping address</h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <p className="font-medium">Juan Dela Cruz</p>
            <p className="text-sm text-muted-foreground">+63 917 555 0142</p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>123 Rizal Street</p>
            <p>Brgy. San Jose, Calamba City</p>
            <p>Laguna 4027, Philippines</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
