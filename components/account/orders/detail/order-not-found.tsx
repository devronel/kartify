import Link from "next/link"
import { PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrderNotFound() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <PackageX
          className="size-6 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h1 className="text-lg font-semibold">Order not found</h1>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        This order doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button
        variant="outline"
        className="mt-4"
        nativeButton={false}
        render={<Link href="/profile/orders" />}
      >
        Back to my orders
      </Button>
    </div>
  )
}
