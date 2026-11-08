import { Skeleton } from "@/components/ui/skeleton"

export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6" aria-hidden="true">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-64 max-w-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      <Skeleton className="h-28 w-full rounded-xl" />

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
