"use client"

import { useCallback, useEffect, useState } from "react"
import { CreditCard, MinusIcon, PlusIcon, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { moneyFormat } from "@/lib/helper"
import { Checkbox } from "../ui/checkbox"
import { CartDetails, CartResponse } from "@/types/cart"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { toast } from "../ui/toast"
import { ValidationErrorResponse } from "@/types/api-error"
import { Input } from "../ui/input"
import useDebounce from "@/hooks/use-debounce"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group"


type CartListProps = {
  data: CartResponse
}

export default function CartList({ data }: CartListProps){

  const [cartItems, setCartItems] = useState<CartDetails[]>(data.items);

  const getAllCartItems = async () => {
    try {
      
      const response = await apiClient("/api/cart")

      const items = response.data.items

      setCartItems(items)

    } catch (error: unknown) {
      
      let description = "Failed to add product to cart.";

      if (isAxiosError(error)) {

        const errorResponse = error.response?.data as ValidationErrorResponse
        
        description = errorResponse.message ?? description;

      }

      toast.add({
        type: "error",
        description,
        priority: "high",
      });

    }
  }

  // Remove item from the cart
  const removeItem = async (id: number) => {
    try {
      
      await apiClient.delete(`/api/cart/items/${id}`)

      toast.add({
        type: "success",
        description: `Item remove from the cart successfully.`,
      })

      getAllCartItems()

    } catch (error: unknown) {

      let description = "Failed to add product to cart.";

      if (isAxiosError(error)) {

        const errorResponse = error.response?.data as ValidationErrorResponse
        
        description = errorResponse.message ?? description;

      }

      toast.add({
        type: "error",
        description,
        priority: "high",
      });

    }
  }


  // Update Quantity
  const updateQuantity = useCallback(
    async (id: number, quantity: number) => {

      const backupItem = cartItems.find(item => item.id === id);

      try {

        const response = await apiClient.patch(`/api/cart/items/${id}`, { 
          quantity 
        });

        const updatedItem = response.data;

        // Sync with the server response
        setCartItems(prev =>
          prev.map(item =>
            item.id === updatedItem.id
              ? {
                  ...item,
                  quantity: updatedItem.quantity,
                  subtotal: updatedItem.subtotal,
                }
              : item
          )
        );

        return true

      } catch (error: unknown) {
        
        let description = "Failed to update item quantity.";

        if (isAxiosError(error)) {

          const errorResponse = error.response?.data as ValidationErrorResponse
          
          description = errorResponse.message ?? description;

        }

        toast.add({
          type: "error",
          description,
          priority: "high",
        });

        setCartItems(prev => {
          return prev.map(item =>
            item.id === backupItem?.id
              ? {
                  ...item,
                  quantity: backupItem?.quantity,
                  subtotal: backupItem?.subtotal
                }
              : item
          )
        });

        return false

      }
    },
    [setCartItems]
  )

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <p className="mt-1 text-slate-500">
          {cartItems.length} items in your cart
        </p>
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-5">
        
        {/* Item List */}
        <div>
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
                                <Button onClick={() => removeItem(item.id)} size="xs" variant="destructive">
                                  <Trash data-icon="inline-start" />
                                  Remove Item
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                           <CartQuantityInput
                            id={item.id}
                            quantity={item.quantity}
                            onUpdate={updateQuantity}
                          />
                        </TableCell>
                        <TableCell>&#8369;{moneyFormat.format(item.subtotal)}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </div>
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

// Stock Quantity Input
type CartQuantityInputProps = {
  id: number;
  quantity: number;
  onUpdate: (id: number, quantity: number) => Promise<boolean>;
};

const CartQuantityInput = ({ id, quantity, onUpdate, }: CartQuantityInputProps) => {
  
  const [value, setValue] = useState(quantity);
  const debouncedValue = useDebounce(value, 500);


  const increment = () => {

    setValue(prev => prev + 1)
  
  }


  const decrement = () => {

    if(value <= 1) return

    setValue(prev => prev = prev - 1)

  }


  // Sync when the server-provided quantity changes.
  useEffect(() => {
    setValue(quantity);
  }, [quantity]);


  // Notify the parent after the user stops changing the input
  useEffect(() => {

    if (debouncedValue === quantity) return;

    let cancelled = false;

    const save = async () => {

      const success = await onUpdate(id, debouncedValue);

      if (!success && !cancelled) {
        setValue(quantity);
      }

    };

    void save();

    return () => {
      cancelled = true;
    };
  }, [id, debouncedValue, quantity, onUpdate]);


  return (
    <InputGroup className="text-sm text-center w-30 h-7.5">
      <InputGroupInput 
        type="number"
        min={1}
        className="text-center"
        value={value}
        onChange={(event) => {
          setValue(Number(event.target.value));
        }}
      />
      <InputGroupAddon align="inline-start">
        <InputGroupButton onClick={decrement} variant="secondary"><MinusIcon /></InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={increment} variant="secondary"><PlusIcon /></InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}