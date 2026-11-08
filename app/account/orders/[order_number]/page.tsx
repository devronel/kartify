import { OrderDetailAddressCard } from "@/components/account/orders/detail/order-detail-address-card"
import { OrderDetailBanner } from "@/components/account/orders/detail/order-detail-banner"
import { OrderDetailHeader } from "@/components/account/orders/detail/order-detail-header"
import { OrderDetailItemsCard } from "@/components/account/orders/detail/order-detail-items-card"
import { OrderDetailPaymentCard } from "@/components/account/orders/detail/order-detail-payment-card"
import { OrderDetailSummaryCard } from "@/components/account/orders/detail/order-detail-summary-card"
import { OrderDetailTimeline } from "@/components/account/orders/detail/order-detail-timeline"

export const metadata = {
  title: "Kartify - Order details",
}

export default function OrderDetailPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <OrderDetailHeader />

      {/*
        TODO(logic): fetch the order by number; when the API returns 404, render <OrderNotFound />.
        TODO(logic): while loading, render <OrderDetailSkeleton />.
        TODO(logic): re-check the order status every few seconds while payment is pending, and again when the tab regains focus.
        TODO(logic): swap the banner below for <PaymentErrorBanner />, <PaymentExpiredBanner />, <PaymentReceivedBanner />, or <OrderCancelledBanner /> depending on the order status.
      */}
      <OrderDetailBanner />

      {/*
        Mobile order: items, summary, payment, address, timeline.
        The wrappers become columns again at md, and the order classes place the
        cards in the requested mobile sequence.
      */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start">
        <div className="contents md:flex md:flex-col md:gap-6">
          <div className="order-1">
            <OrderDetailItemsCard />
          </div>
          <div className="order-5 md:order-none">
            <OrderDetailTimeline />
          </div>
        </div>

        <div className="contents md:flex md:flex-col md:gap-6">
          <div className="order-2 md:order-none">
            <OrderDetailSummaryCard />
          </div>
          <div className="order-3 md:order-none">
            <OrderDetailPaymentCard />
          </div>
          <div className="order-4 md:order-none">
            <OrderDetailAddressCard />
          </div>
        </div>
      </div>
    </div>
  )
}
