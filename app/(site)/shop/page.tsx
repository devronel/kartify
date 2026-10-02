import ProductList from "@/components/shop/product-list";

const products = [
  { id: 1, name: "Minimal Watch", price: 129.99, image: "/vercel.svg", tag: "New" },
  { id: 2, name: "Leather Backpack", price: 89.99, originalPrice: 119.99, image: "/vercel.svg" },
  { id: 3, name: "Wireless Earbuds", price: 59.99, image: "/vercel.svg", tag: "New" },
  { id: 4, name: "Running Shoes", price: 119.99, originalPrice: 149.99, image: "/vercel.svg", tag: "Sale" },
  { id: 5, name: "Cotton T-Shirt", price: 29.99, image: "/vercel.svg" },
  { id: 6, name: "Denim Jacket", price: 99.99, image: "/vercel.svg", tag: "New" },
  { id: 7, name: "Smart Speaker", price: 79.99, originalPrice: 99.99, image: "/vercel.svg" },
  { id: 8, name: "Yoga Mat", price: 34.99, image: "/vercel.svg" },
  { id: 9, name: "Ceramic Mug Set", price: 24.99, image: "/vercel.svg" },
  { id: 10, name: "Sunglasses", price: 49.99, image: "/vercel.svg", tag: "New" },
  { id: 11, name: "Desk Lamp", price: 44.99, originalPrice: 59.99, image: "/vercel.svg" },
  { id: 12, name: "Notebook", price: 14.99, image: "/vercel.svg" },
];

export const metadata = {
  title: "Kartify - Shop the Best Deals Online",
  description:
    "Discover a wide range of products at unbeatable prices. Shop electronics, fashion, home essentials, and more with fast shipping and secure checkout.",
};

export default function Shop() {

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Shop All Collections</h1>
          <p className="mt-1 text-slate-500">Browse Nova Store's full collection of premium apparel, luxury accessories, and smart tech.</p>
        </div>

        <ProductList />

      </div>
    </div>
  );
}
