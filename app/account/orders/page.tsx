import Link from "next/link"
import {
  AlertCircle,
  PackageOpen,
  PackageSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CardList from "@/components/account/orders/card-list"
import { apiServer } from "@/lib/api-server"
import { OrderResponse, OrderStatus } from "@/types/order"
import { Paginate } from "@/types/paginate"
import KartifyPagination from "@/components/shared/kartify-pagination"
import StatusFilter from "@/components/account/orders/status-filter"

export const metadata = {
  title: "Kartify - My Orders",
}

type Props = {
  searchParams: Promise<{
    page?: number
    status?: OrderStatus
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {

  try {

    const queryParams = new URLSearchParams();
    const params = await searchParams;

    if(params){

      if(params.page){
        queryParams.set("page", String(params.page))
      }
  
      if(params.status){
        queryParams.set("status", String(params.status))
      }
      
    }

    const response = await apiServer(`/api/orders?${queryParams.toString()}`)

    const payload: Paginate<OrderResponse> = response.data

    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold">My orders</h1>
          <p className="text-sm text-muted-foreground">
            Track and review the orders you have placed with Kartify.
          </p>
        </div>
  
        {/* TODO(logic): tab change */}
        <StatusFilter />
  
        {/*
          TODO(logic): while loading, render <OrdersListSkeleton />
          TODO(logic): when there are no orders, render <OrdersEmptyState />
          TODO(logic): when the selected filter has no results, render <OrdersFilteredEmptyState />
          TODO(logic): when the request fails, render <OrdersErrorState />
        */}


        {/* Order list */}
        {
          payload.totalItems > 0 ? (
            <CardList orders={response.data} />
          ) : (
            <OrdersEmptyState />
          )
        }


        {/* Pagination */}
        {
          payload.totalItems > payload.pageSize && (
            <KartifyPagination
              currentPage={params.page ?? 0}
              totalPages={payload.totalPages}
              visiblePages={3}
              hasPrevious={payload.hasPrevious}
              hasNext={payload.hasNext}
            />
          )
        }
        
      </div>
    )

  } catch (error: unknown) {
    return <OrdersErrorState />
  }

}

function SkeletonOrderCard() {
  return (
    <div className="rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t pt-4 md:w-56 md:shrink-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  )
}

function OrdersListSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <SkeletonOrderCard />
      <SkeletonOrderCard />
      <SkeletonOrderCard />
      <SkeletonOrderCard />
    </div>
  )
}

function OrdersEmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <PackageOpen
          className="size-6 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg font-semibold">No orders yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Orders you place will show up here.
      </p>
      <Button
        className="mt-4"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Start shopping
      </Button>
    </div>
  )
}

function OrdersFilteredEmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <PackageSearch
          className="size-6 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg font-semibold">No orders with this status</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different status to see more orders.
      </p>
    </div>
  )
}

function OrdersErrorState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <AlertCircle
          className="size-6 text-destructive"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg font-semibold">
        We couldn&apos;t load your orders.
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Check your connection and try again.
      </p>
      <Button variant="outline" className="mt-4">
        Try again
      </Button>
    </div>
  )
}
