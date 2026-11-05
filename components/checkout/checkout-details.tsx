"use client"

import Link from "next/link";
import { Banknote, Lock, MapPin, Plus, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { moneyFormat } from "@/lib/helper";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "../ui/button";
import { CheckoutDetailsResponse } from "@/types/checkout";
import { use, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";


const paymentMethods = [
  {
    id: "paymongo",
    name: "PayMongo",
    initials: null,
    logo: "assets/logos/paymongo-logo.png",
    description: "Pay securely with GCash, Maya, or card via PayMongo.",
    isRecommended: true,
    isImagePlaceholder: true,
    disabled: false,
  },
  {
    id: "cod",
    name: "Cash on delivery",
    initials: null,
    description: "Pay in cash when your order arrives.",
    isRecommended: false,
    isImagePlaceholder: false,
    disabled: true,
  },
];


type CheckoutDetailsProps = {
  checkoutDetails: CheckoutDetailsResponse
}

export default function CheckoutDetails({ checkoutDetails } : CheckoutDetailsProps){

  const { addresses, cartItems, subtotal, total } = checkoutDetails
  const [addressId, setAddressId] = useState<number | null>(null);

  const checkout = async () => {
    
    try {
      
      const response = await apiClient.post("/api/checkout", { addressId: addressId }, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      window.location.replace(response.data.checkoutUrl)

    } catch (error: unknown) {
      console.log(error)
    }

  }

  useEffect(() => {
    const defaultAddress = addresses.find(address => address.isDefault)
    if(defaultAddress){
      setAddressId(defaultAddress.id)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
      {/* Left column */}
      <div className="flex flex-col gap-6">
        
        {/* Shipping address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
              Shipping address
            </CardTitle>
            <CardDescription>Where should we deliver your order?</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                htmlFor={`address-${address.id}`}
                className="flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5"
              >
                <input
                  type="radio"
                  id={`address-${address.id}`}
                  name="shipping-address"
                  checked={address.id === addressId}
                  value={address.id}
                  onChange={() => setAddressId(address.id)}
                  className="mt-1 size-4 accent-primary"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{address.shippingRecipientName}</span>
                    <Badge variant="secondary">{address.label}</Badge>
                    {address.isDefault ? <Badge>Default</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{address.shippingPhone}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.shippingAddressLine1 + ", " + address.shippingBarangay}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.shippingCity + ", " + address.shippingProvince + " " + address.shippingPostalCode}
                  </p>
                </div>
              </label>
            ))}

            <Link
              href="/profile/address"
              className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add new address
            </Link>
          </CardContent>
        </Card>

        {/* Payment method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-4 text-muted-foreground" aria-hidden="true" />
              Payment method
            </CardTitle>
            <CardDescription>All transactions are secure and encrypted.</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                htmlFor={`payment-${method.id}`}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                  method.disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer has-checked:border-primary has-checked:bg-primary/5"
                }`}
              >
                <input
                  type="radio"
                  id={`payment-${method.id}`}
                  name="payment-method"
                  defaultChecked={method.isRecommended}
                  disabled={method.disabled}
                  className="size-4 accent-primary disabled:cursor-not-allowed"
                />
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-sm font-semibold text-foreground">
                  {
                    method.isImagePlaceholder ? (
                      <img src={method.logo} />
                    ) : method.initials ? (
                      method.initials
                    ) : (
                      <Banknote className="size-5 text-muted-foreground" aria-hidden="true" />
                    )
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                {method.disabled ? (
                  <Badge variant="outline" className="text-muted-foreground">
                    Unavailable
                  </Badge>
                ) : method.isRecommended ? (
                  <Badge variant="secondary">Recommended</Badge>
                ) : null}
              </label>
            ))}

            {/* Error state — TODO(logic): show when payment fails
            <p className="text-sm text-destructive">
              Your payment could not be processed. Please try again.
            </p>
            */}
          </CardContent>
        </Card>
      </div>

      {/* Order summary */}
      <Card className="sticky top-20">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Order summary</CardTitle>
          <CardDescription>4 items</CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="divide-y">
            {cartItems.map((item) => (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0">
                <div className="size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                  <img src={item.productImage} alt={item.productName} className="size-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-foreground">{item.productName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  &#8369;{moneyFormat.format(item.price)}
                </p>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">&#8369;{moneyFormat.format(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-primary">Free</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">Total</span>
            <span className="text-base font-semibold text-foreground">
              &#8369;{moneyFormat.format(total)}
            </span>
          </div>

          {/* Empty state — TODO(logic): show this instead of the summary when the cart is empty
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h2 className="text-lg font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add products before checking out.</p>
            <Link href="/shop" className={buttonVariants({ className: "mt-4" })}>
              Browse products
            </Link>
          </div>
          */}
        </CardContent>

        <CardFooter className="flex-col gap-3 border-t">
          <Button onClick={checkout} className="w-full" size="lg">
            <Lock className="size-4" aria-hidden="true" />
            Place order
          </Button>

          {/* Disabled state — TODO(logic): disable the button and show this when no address or payment is selected
          <p className="text-xs text-muted-foreground">Select an address and payment method to continue.</p>
          */}

          <p className="text-xs text-muted-foreground">Secure checkout — your details are encrypted.</p>
        </CardFooter>
      </Card>
    </div>
  )
}