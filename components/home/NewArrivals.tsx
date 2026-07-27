import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Minimal Watch",
    price: 129.99,
    image: "/vercel.svg",
    tag: "New",
  },
  {
    id: 2,
    name: "Leather Backpack",
    price: 89.99,
    image: "/vercel.svg",
    tag: "New",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 59.99,
    image: "/vercel.svg",
    tag: "New",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 119.99,
    image: "/vercel.svg",
    tag: "New",
  },
];

export default function NewArrivals() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">New Arrivals</h2>
            <p className="mt-1 text-slate-500">Fresh picks just for you</p>
          </div>
          <Link
            href="/new-arrivals"
            className="text-sm font-medium text-slate-900 hover:underline hidden sm:block"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300"
            >
              <div className="relative aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden flex items-center justify-center">
                <span className="absolute top-3 left-3 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
                  {product.tag}
                </span>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-medium text-slate-900 truncate">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/new-arrivals"
          className="mt-6 flex items-center justify-center text-sm font-medium text-slate-900 hover:underline sm:hidden"
        >
          View all new arrivals &rarr;
        </Link>
      </div>
    </section>
  );
}
