import NavBar from "@/components/shared/navbar";
import { CartProvider } from "@/context/CartContext";
import { apiServer } from "@/lib/api-server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Kartify",
    template: "%s | Kartify",
  },
  description: "Shop quality products at Kartify.",
};

export default async function HomeLayout({ children }: { children: React.ReactNode }) {

  let cartItemCount = 0

  try {
    const response = await apiServer('/api/cart/items/count')
    cartItemCount = response.data  
  } catch (error) {
    cartItemCount = 0
  }


  return (
    <CartProvider cartItemCount={cartItemCount}>
      <section>
          <NavBar />
          {children}
      </section>
    </CartProvider>
  )
}