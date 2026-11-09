import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



type OrderDetailAddressCardProps = {
  shippingRecipientName: string
  shippingPhone: string
  shippingAddressLine1: string
  shippingBarangay: string
  shippingCity: string
  shippingProvince: string
  shippingPostalCode: string
  shippingCountry: string
}

export function OrderDetailAddressCard({
  shippingRecipientName,
  shippingPhone,
  shippingAddressLine1,
  shippingBarangay,
  shippingCity,
  shippingProvince,
  shippingPostalCode,
  shippingCountry
}: OrderDetailAddressCardProps) {
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
            <p className="font-medium">{shippingRecipientName}</p>
            <p className="text-sm text-muted-foreground">{shippingPhone}</p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{shippingAddressLine1}</p>
            <p>{shippingBarangay}, {shippingCity}</p>
            <p>{shippingProvince} {shippingPostalCode}, {shippingCountry}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
