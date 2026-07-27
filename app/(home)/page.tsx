import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <NewArrivals />
    </main>
  );
}
