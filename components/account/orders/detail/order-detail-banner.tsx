"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { ApiError } from "@/types/api-error"
import { PaymentAction } from "@/types/order"
import { useState } from "react"

type OrderDetailBannerProp = {
  paymentAction: PaymentAction
  checkoutUrl: string
  orderNumber: string
}

export function OrderDetailBanner({ paymentAction, checkoutUrl, orderNumber }: OrderDetailBannerProp) {

  const [isRetrying, setIsRetrying] = useState<boolean>(false)
  
  // Retry Payment
  const retry = async () => {

    if(isRetrying) return

    try {
      
      setIsRetrying(true)
      
      const response = await apiClient.post(`/api/checkout/retry/${orderNumber}`)

      const payload = response.data

      if(payload.checkoutUrl){
        window.location.replace(response.data.checkoutUrl)
      }
      
    } catch (error: unknown) {

      if (!isAxiosError<ApiError>(error) || !error.response) {
        toast.add({
          type: "Something wen't wrong",
          description: "We couldn't reach the server. If an order was placed, you'll find it in My orders.",
          priority: "high",
        })
        return;
      }

      const { data } = error.response

      toast.add({
        type: "Error",
        description: data.message ?? data.error,
        priority: "high",
      })

    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <section aria-labelledby="order-banner-heading">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-1">
            <h2 id="order-banner-heading" className="text-base font-semibold">
              Waiting for payment
            </h2>

            {/* TODO(logic): countdown and expired check from expiresAt */}
            <p className="text-sm text-muted-foreground">
              Pay within 30 min to keep your order.
            </p>

          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {
              paymentAction === "PAY" && checkoutUrl && (
                <a href={checkoutUrl} target="_blank" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                  Pay now
                </a>
              )
            }
            {
              paymentAction === "RETRY" && (
                <Button onClick={retry} disabled={isRetrying}>Try again</Button>
              )
            }
            <p className="text-xs text-muted-foreground">
              Already paid? This page updates automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
