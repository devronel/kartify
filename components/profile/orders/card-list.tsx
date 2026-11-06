import CustomPagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moneyFormat } from "@/lib/helper";
import { OrderResponse, OrderStatus } from "@/types/order";
import { Paginate } from "@/types/paginate";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import Link from "next/link";

type CardListProps = {
  orders: Paginate<OrderResponse>
}

export default function CardList({ orders }: CardListProps){

  return (
    <>
      <ul className="space-y-4">
        {
          orders.payload.map(order => {
            return (
              <li key={order.orderNumber}>
                <article className="rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
                  <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href="/profile/orders/ORD-2026-5A9F2C7D8E31"
                            className="font-medium text-foreground hover:underline"
                          >
                            { order.orderNumber }
                          </Link>
                          {/* <p className="mt-0.5 text-xs text-muted-foreground">
                            Oct 22, 2026
                          </p> */}
                        </div>
                        {
                          <OrderBadgeStatus status={order.status} />
                        }
                      </div>

                      <ul className="space-y-2.5">
                        {
                          order.orderItems.map(orderItem => {
                            return (
                              <li key={orderItem.id} className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                  <img src={orderItem.productImage} alt={orderItem.productName} />
                                </div>
                                <span className="truncate text-foreground">
                                  { orderItem.productName }
                                </span>
                              </li>
                            )
                          })
                        }
                        {
                          order.itemCount > 3 ? (
                            <li className="pl-13 text-xs text-muted-foreground">
                              +{ order.itemCount - 3 } more item{ order.itemCount - 3 > 1 ? "s" : "" }
                            </li>
                          ) : null
                        }
                      </ul>

                    </div>

                    <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                      <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                        <span className="text-xs text-muted-foreground">
                          { order.itemCount } item
                        </span>
                        <span className="text-base font-semibold text-foreground">
                          &#8369;{moneyFormat.format(order.total)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {
                          order.canPay ? (
                            <Button className="w-full" disabled>
                              Pay now
                            </Button>
                          ) : null
                        }
                        <Button variant="outline" className="w-full">
                          View order
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })
        }
      </ul>
      
      {/* TODO(logic): pagination */}
      
    </>
  )
}


const OrderBadgeStatus = ({ status }: { status: OrderStatus }) => {

  switch (status) {
    case "PAID":
      return <Badge>{status}</Badge>
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        >
          Waiting for payment
        </Badge>
      )
    case "PROCESSING":
    case "DELIVERED":
      return <Badge variant="secondary">{status}</Badge>
    case "CANCELLED":
      return <Badge variant="secondary" className="text-muted-foreground">{status}</Badge>
    case "SHIPPED":
      return  <Badge variant="outline">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }

}