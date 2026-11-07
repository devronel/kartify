import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ItemProblem } from "@/types/checkout";

const REASON_LABEL: Record<ItemProblem["reason"], (p: ItemProblem) => string> = {
  OUT_OF_STOCK: () => "Out of stock",
  INSUFFICIENT_STOCK: (p) =>
    p.availableStock != null ? `Only ${p.availableStock} left` : "Not enough stock",
  PRODUCT_UNAVAILABLE: () => "No longer available",
  VARIANT_MISMATCH: () => "This option changed. Remove it and add it again",
  PRICE_CHANGED: () => "Price changed. Remove it and add it again",
};

export function CheckoutItemProblems({ problems }: { problems: ItemProblem[] }) {
  if (problems.length === 0) return null;

  return (
    <Alert variant="destructive">
      <TriangleAlert className="size-4" aria-hidden="true" />
      <AlertTitle>Your cart needs attention</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {problems.map((p) => (
            <li key={p.cartItemId}>
              <span className="font-medium">{p.name}</span>: {REASON_LABEL[p.reason](p)}
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="mt-3">
          <Link href="/cart">Review cart</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}