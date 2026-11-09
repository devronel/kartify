import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderItem } from "@/types/order"
import { moneyFormat } from "@/lib/helper"


type OrderDetailItemsCardProps = {
  items: OrderItem[]
}

export function OrderDetailItemsCard({ items }: OrderDetailItemsCardProps) {
  return (
    <section aria-labelledby="order-items-heading">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="order-items-heading">Items</h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="divide-y">
            {
              items.map(item => (
                <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted sm:size-16">
                    <img src={item.productImage} alt={item.productName} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      { item.variantLabel }
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      &#8369;{ moneyFormat.format(item.price) } x { item.quantity }
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">&#8369;{moneyFormat.format(item.lineTotal)}</p>
                </li>
              ))
            }
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
