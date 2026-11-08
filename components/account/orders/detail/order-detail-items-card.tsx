import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderDetailItemsCard() {
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
            <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
              {/* TODO(logic): replace with the real product thumbnail */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted sm:size-16">
                <Package
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium">Everyday Cotton Tee</p>
                <p className="text-sm text-muted-foreground">
                  Color: Blue / Size: M
                </p>
                {/* TODO(logic): format money */}
                <p className="mt-1 text-sm text-muted-foreground">
                  ₱599.00 × 2
                </p>
              </div>

              {/* TODO(logic): format money */}
              <p className="shrink-0 text-sm font-medium">₱1,198.00</p>
            </li>

            <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
              {/* TODO(logic): replace with the real product thumbnail */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted sm:size-16">
                <Package
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium">Canvas Cap</p>
                <p className="text-sm text-muted-foreground">
                  Color: Sand / Size: One size
                </p>
                {/* TODO(logic): format money */}
                <p className="mt-1 text-sm text-muted-foreground">
                  ₱749.00 × 1
                </p>
              </div>

              {/* TODO(logic): format money */}
              <p className="shrink-0 text-sm font-medium">₱749.00</p>
            </li>

            <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
              {/* TODO(logic): replace with the real product thumbnail */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted sm:size-16">
                <Package
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium">Woven Tote Bag</p>
                <p className="text-sm text-muted-foreground">Color: Natural</p>
                {/* TODO(logic): format money */}
                <p className="mt-1 text-sm text-muted-foreground">
                  ₱1,249.50 × 1
                </p>
              </div>

              {/* TODO(logic): format money */}
              <p className="shrink-0 text-sm font-medium">₱1,249.50</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
