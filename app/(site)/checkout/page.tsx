import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Banknote, ImageIcon, Lock, MapPin, Plus, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { moneyFormat } from "@/lib/helper";
import Image from "next/image";
import { apiServer } from "@/lib/api-server";
import CheckoutDetails from "@/components/checkout/checkout-details";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};


export default async function CheckoutPage() {

  try {

    const response = await apiServer("/api/checkout")

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
  
        <CheckoutDetails checkoutDetails={response.data}/>
        
      </main>
    );
    
  } catch (error) {
    notFound()
  }

}
