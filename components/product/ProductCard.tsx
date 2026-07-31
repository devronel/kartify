import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
}

export default function ProductCard({ id, name, price, originalPrice, image, tag }: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link
      href={`/products/${id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300"
    >
      <div className="relative aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden flex items-center justify-center">
        {tag && (
          <span className="absolute top-3 left-3 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
            {tag}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
            -{discount}%
          </span>
        )}
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="object-contain transition-transform group-hover:scale-110"
        />
      </div>
      <h3 className="text-sm font-medium text-slate-900 truncate">{name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-900">${price.toFixed(2)}</p>
        {originalPrice && (
          <p className="text-xs text-slate-400 line-through">${originalPrice.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}
