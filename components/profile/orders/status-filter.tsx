"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatus } from "@/types/order";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


type TabValue = OrderStatus | "ALL"

export default function StatusFilter(){

  const queryParameters = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<string>(queryParameters.get("status") ?? "ALL")

  const filterStatus = (value: TabValue) => {
    
    setActiveTab(value)

    const params = new URLSearchParams(queryParameters.toString());
    
    params.delete("page")

    if(params.get("status") === value){
      return;
    }
    
    if(value == "ALL"){
      params.delete("status")
    }else{
      params.set("status", value);
    }

    router.push(`${pathname}?${params.toString()}`)

  }

  return (
    <Tabs onValueChange={(value) => filterStatus(value)} value={activeTab}>
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList className="w-max">
          <TabsTrigger value="ALL" className="shrink-0 px-3">
            All
          </TabsTrigger>
          <TabsTrigger value="PENDING" className="shrink-0 px-3">
            Waiting for payment
          </TabsTrigger>
          <TabsTrigger value="PAID" className="shrink-0 px-3">
            Paid
          </TabsTrigger>
          <TabsTrigger value="PROCESSING" className="shrink-0 px-3">
            Processing
          </TabsTrigger>
          <TabsTrigger value="SHIPPED" className="shrink-0 px-3">
            Shipped
          </TabsTrigger>
          <TabsTrigger value="DELIVERED" className="shrink-0 px-3">
            Delivered
          </TabsTrigger>
          <TabsTrigger value="CANCELLED" className="shrink-0 px-3">
            Cancelled
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  )
}