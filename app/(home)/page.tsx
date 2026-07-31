import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";

export const metadata = {
  title: "Kartify - Shop the Best Deals Online",
  description:
    "Discover a wide range of products at unbeatable prices. Shop electronics, fashion, home essentials, and more with fast shipping and secure checkout.",
};

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <NewArrivals />
    </main>
  );
}
