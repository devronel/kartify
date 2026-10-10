"use client"

import { useState } from "react"
import { CreditCard, Heart, MinusIcon, PlusIcon, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Input } from "../ui/input"
import { moneyFormat } from "@/lib/helper"
import { Checkbox } from "../ui/checkbox"
import { CartDetails, CartResponse } from "@/types/cart"


type CartListProps = {
  data: CartResponse
}

export default function CartList({ data }: CartListProps){

  const [cartItems, setCartItems] = useState<CartDetails[]>(data.items);

  return (
    <>
      <div className="grid grid-cols-[1fr_400px] gap-5">
        
        {/* Item List */}
        <div className="border rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                cartItems.map(item => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className=" align-top">
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex w-fit gap-4">
                          <div className="w-20 h-20 rounded overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt="" 
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <div className="flex flex-col gap-1">
                              <h3 className="font-bold">{item.name}</h3>
                              <p className="text-[12px]">&#8369;{moneyFormat.format(item.price)}</p>
                              {
                                item.productVariantId && (
                                  <p className="text-[12px]">Red/Medium</p>
                                )
                              }
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <Button size="xs" variant="destructive">
                                <Trash data-icon="inline-start" />
                                Remove Item
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>&#8369;{moneyFormat.format(item.subtotal)}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </div>

        {/* Checkout */}
        <div>
          <div className="border rounded p-2 sticky top-20">
            <div className="p-2 border-b">
              <h2 className="font-bold text-lg">Order Summary</h2>
            </div>
            <div className="px-2 py-4 flex flex-col gap-2 border-b">
              <div className="flex items-center justify-between">
                <p>Items selected</p>
                <p>2</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Subtotal</p>
                <p>&#8369;2,999</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Shipping Costs:</p>
                <p>Free</p>
              </div>
            </div>
            <div className="px-2 py-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p>Total</p>
                <p>&#8369;2,999</p>
              </div>
            </div>
            <div className="p-2 flex flex-col gap-2">
              <Button size={"lg"}>
                <CreditCard data-icon="inline-start" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}