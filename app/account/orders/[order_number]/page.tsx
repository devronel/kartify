import { OrderDetailAddressCard } from "@/components/account/orders/detail/order-detail-address-card"
import { OrderDetailBanner } from "@/components/account/orders/detail/order-detail-banner"
import { OrderDetailHeader } from "@/components/account/orders/detail/order-detail-header"
import { OrderDetailItemsCard } from "@/components/account/orders/detail/order-detail-items-card"
import { OrderDetailPaymentCard } from "@/components/account/orders/detail/order-detail-payment-card"
import { OrderDetailSummaryCard } from "@/components/account/orders/detail/order-detail-summary-card"
import { OrderDetailTimeline } from "@/components/account/orders/detail/order-detail-timeline"
import { apiServer } from "@/lib/api-server"
import { OrderDetailsResponse } from "@/types/order"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Kartify - Order details",
}

type Props = {
  params: Promise<{ order_number: string }>;
}

export default async function OrderDetailPage({ params }: Props) {

  const { order_number } = await params;

  try {
    
    const response = await apiServer(`api/orders/${order_number}`)

    const payload: OrderDetailsResponse = response.data

    console.log(payload)

    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        
        <OrderDetailHeader
          orderNumber={payload.orderNumber} 
          createdAt={payload.createdAt} 
          orderStatus={payload.status}
          isExpired={payload.isExpired}
        />
  
        {/*
          TODO(logic): fetch the order by number; when the API returns 404, render <OrderNotFound />.
          TODO(logic): while loading, render <OrderDetailSkeleton />.
          TODO(logic): re-check the order status every few seconds while payment is pending, and again when the tab regains focus.
          TODO(logic): swap the banner below for <PaymentErrorBanner />, <PaymentExpiredBanner />, <PaymentReceivedBanner />, or <OrderCancelledBanner /> depending on the order status.
        */}

        {
          payload.paymentAction !== "NONE" && (
            <OrderDetailBanner 
              paymentAction={payload.paymentAction}
              checkoutUrl={payload.payment.checkoutUrl}
              orderNumber={payload.orderNumber}
            />
          )
        }
  
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start">
          <div className="contents md:flex md:flex-col md:gap-6">
            <div className="order-1">
              <OrderDetailItemsCard 
                items={payload.orderItems}
              />
            </div>
            <div className="order-5 md:order-0">
              <OrderDetailTimeline 
                timelines={payload.timeline}
              />
            </div>
          </div>
  
          <div className="contents md:flex md:flex-col md:gap-6">
            <div className="order-2 md:order-0">
              <OrderDetailSummaryCard 
                subtotal={payload.subtotal}
                total={payload.total}
              />
            </div>
            <div className="order-3 md:order-0">
              <OrderDetailPaymentCard 
                paymentMethod={payload.payment.paymentMethod}
                paymentStatus={payload.payment.status}
                isExpired={payload.isExpired}
              />
            </div>
            <div className="order-4 md:order-0">
              <OrderDetailAddressCard 
                shippingRecipientName={payload.shippingRecipientName}
                shippingPhone={payload.shippingPhone}
                shippingAddressLine1={payload.shippingAddressLine1}
                shippingBarangay={payload.shippingBarangay}
                shippingCity={payload.shippingCity}
                shippingProvince={payload.shippingProvince}
                shippingPostalCode={payload.shippingPostalCode}
                shippingCountry={payload.shippingCountry}
              />
            </div>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    console.log(error)
    notFound()
  }

}
