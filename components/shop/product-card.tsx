import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

type PublicProductProps = {
  id: number,
  category: string,
  name: string,
  slug: string,
  description: string,
  shortDescription: string,
  price: number
  comparePrice: number,
  hasVariant: boolean,
  primaryImage: string
}


const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


export default function ProductCard({ 
  id,
  category,
  name,
  slug,
  description,
  shortDescription,
  price,
  comparePrice,
  hasVariant,
  primaryImage
}: PublicProductProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300">
      <div className="relative aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden flex items-center justify-center">
        <img src={primaryImage} alt={name} className="object-contain transition-transform group-hover:scale-110" />
      </div>
      <h3 className="text-sm font-medium text-slate-900 truncate">{name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-900">&#8369;{formatter.format(price)}</p>
        {comparePrice && (
          <p className="text-xs text-slate-400 line-through">${comparePrice.toFixed(2)}</p>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <Button size={'sm'} className="flex-1 cursor-pointer gap-2 transition-all hover:bg-primary/80 active:scale-95">
          Add to Cart
        </Button>
        <Button
            variant="outline"
            size="sm"
            className="cursor-pointer transition-all duration-300 active:scale-95"
          >
          <Link href={`/shop/${slug}`} className="group">
            <ArrowUpRight className="transition-all duration-300 group-hover:rotate-45" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
