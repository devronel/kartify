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

  try {
    const response = await apiServer("/api/cart");

    const data: CartResponse = response.data
  
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
            <p className="mt-1 text-slate-500">
              {data.items.length} items in your cart
            </p>
          </div>
  
          <CartList 
            data={data}
          />
  
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }

}