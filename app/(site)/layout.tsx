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

  const [itemCount, crt] = await Promise.allSettled([
    apiServer('/api/cart/items/count'),
    apiServer('/api/cart')
  ]);

  const cartItemCount = itemCount.status === 'fulfilled' ? itemCount.value.data : 0
  const cart = crt.status === 'fulfilled' ? crt.value.data : null

  return (
    <CartProvider cartItemCount={cartItemCount} cart={cart}>
      <section>
          <NavBar />
          {children}
      </section>
    </CartProvider>
  )
}