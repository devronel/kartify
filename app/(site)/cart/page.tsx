import CartList from "@/components/cart/cart-list";
import { apiServer } from "@/lib/api-server";
import { CartResponse } from "@/types/cart";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Shopping Cart",
  robots: { index: false },
};


export default async function CartPage(){

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
        <CartList />

      </div>
    </div>
  )

}