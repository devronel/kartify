import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Banknote, Lock, MapPin, Plus, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { moneyFormat } from "@/lib/helper";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

const addresses = [
  {
    id: "home",
    label: "Home",
    isDefault: true,
    name: "Juan Dela Cruz",
    phone: "0917 123 4567",
    line1: "123 Rizal Street, Brgy. San Jose",
    line2: "Calamba City, Laguna 4027",
  },
  {
    id: "office",
    label: "Office",
    isDefault: false,
    name: "Juan Dela Cruz",
    phone: "0917 123 4567",
    line1: "Unit 8, 45 Ayala Avenue, Brgy. Bel-Air",
    line2: "Makati City, Metro Manila 1209",
  },
];

const paymentMethods = [
  {
    id: "gcash",
    name: "GCash",
    initials: "G",
    description: "Pay instantly with your GCash wallet.",
    isRecommended: true,
  },
  {
    id: "maya",
    name: "Maya",
    initials: "M",
    description: "Pay instantly with your Maya account.",
    isRecommended: false,
  },
  {
    id: "cod",
    name: "Cash on delivery",
    initials: null,
    description: "Pay in cash when your order arrives.",
    isRecommended: false,
  },
];

const cartItems = [
  { id: 1, name: "Kartify Classic Cotton Tee", image: "/vercel.svg", quantity: 2, lineTotal: 1198 },
  { id: 2, name: "Wireless Earbuds Pro", image: "/vercel.svg", quantity: 1, lineTotal: 2499 },
  { id: 3, name: "Full-Grain Leather Wallet", image: "/vercel.svg", quantity: 1, lineTotal: 899 },
];

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to cart
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your order, choose a delivery address, and pick a payment method.
        </p>
      </div>

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
                  className="flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    id={`address-${address.id}`}
                    name="shipping-address"
                    defaultChecked={address.isDefault}
                    className="mt-1 size-4 accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{address.name}</span>
                      <Badge variant="secondary">{address.label}</Badge>
                      {address.isDefault ? <Badge>Default</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
                    <p className="text-sm text-muted-foreground">{address.line1}</p>
                    <p className="text-sm text-muted-foreground">{address.line2}</p>
                  </div>
                  {/* TODO(logic): edit this address */}
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
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    id={`payment-${method.id}`}
                    name="payment-method"
                    defaultChecked={method.isRecommended}
                    className="size-4 accent-primary"
                  />
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-foreground">
                    {method.initials ? (
                      method.initials
                    ) : (
                      <Banknote className="size-5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  {method.isRecommended ? <Badge variant="secondary">Recommended</Badge> : null}
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
                    <img src={item.image} alt={item.name} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    &#8369;{moneyFormat.format(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">&#8369;{moneyFormat.format(4596)}</span>
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
                &#8369;{moneyFormat.format(4596)}
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
            {/* TODO(logic): submit order */}
            <Button className="w-full" size="lg">
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
    </main>
  );
}
