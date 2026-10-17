"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, MinusIcon, PlusIcon, ShoppingCart, Trash2 } from "lucide-react"
import { Button, buttonVariants } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"
import { moneyFormat } from "@/lib/helper"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { toast } from "../ui/toast"
import { ValidationErrorResponse } from "@/types/api-error"
import useDebounce from "@/hooks/use-debounce"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group"
import { useCart } from "@/context/CartContext"


export default function CartList(){

  const { 
    setCartCount, 
    cartItems, 
    setCartItems, 
    getCartItems, 
    hasUnavailableItems,
    setHasUnavailableItems 
  } = useCart()
  const [selectItems, setSelectItems] = useState<number[]>([])

  
  // Remove item from the cart
  const removeItem = async (id: number, quantity: number) => {
    try {
      
      await apiClient.delete(`/api/cart/items/${id}`)

      toast.add({
        type: "success",
        description: `Item remove from the cart successfully.`,
      })

      getCartItems()

      setCartCount(prev => prev - quantity)

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

      try {

        const response = await apiClient.patch(`/api/cart/items/${id}`, { 
          quantity 
        });

        const updatedItem = response.data;

        setCartItems(prev => 
          prev.map(item => 
            item.id === id
              ? { 
                  ...item, 
                  quantity: updatedItem.quantity, 
                  subtotal: updatedItem.subtotal, 
                  availableStock: updatedItem.availableStock,
                  isAvailable: updatedItem.isAvailable 
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
     
        const backupItem = cartItems.find(item => item.id === id);
        
        setCartItems(prev => 
          prev.map(item => 
            item.id === backupItem?.id
              ? { 
                  ...item, 
                  quantity: backupItem?.quantity, 
                  subtotal: backupItem?.subtotal,
                  availableStock: backupItem?.availableStock,
                  isAvailable: backupItem?.isAvailable  
                }
              : item
          )
        )

        return false

      }
    },
    [setCartItems]
  )


  const checkout = () => {
    console.log(selectItems)
  }


  const subtotal = useMemo(() => {

    const matchData = cartItems.filter(item => selectItems.includes(item.id))

    return matchData.reduce((accumulater, currentValue) => {
      return accumulater + currentValue.subtotal
    }, 0)

  }, [selectItems])


  useEffect(() => {
    setCartCount(cartItems.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0));
  }, [cartItems])


  useEffect(() => {
    const cartItemsIds = cartItems.map(item => item.id)
    setSelectItems(cartItemsIds)
    setHasUnavailableItems(cartItems.some(item => !item.isAvailable))
  }, [cartItems])


  useEffect(() => {
    getCartItems()
  }, []);

  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Shopping cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* Empty state — shown when the cart has no items */}
      {cartItems.length === 0 && (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Browse the shop and add products to your cart. They will show up here.
          </p>
          <Link href="/shop" className={buttonVariants({ className: "mt-4" })}>
            Continue shopping
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/* Loading state — TODO(logic): render <CartListSkeleton /> while getCartItems() is in flight */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">

        {/* Item List */}
        {cartItems.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={cartItems.length > 0 && selectItems.length === cartItems.length}
                  disabled={cartItems.length === 0}
                />
                {/* TODO(logic): toggle all items in selectItems */}
                <Label htmlFor="select-all" className="text-sm font-medium">
                  Select all
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectItems.length} of {cartItems.length} selected
              </p>
            </div>

            <ul className="divide-y">
              {cartItems.map(item => {
                const isOutOfStock = !item.isAvailable && item.availableStock <= 0
                const isLowStock = !item.isAvailable && item.availableStock > 0

                return (
                  <li
                    key={item.id}
                    className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${isOutOfStock ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`select-item-${item.id}`}
                        className="mt-1"
                        checked={selectItems.includes(item.id)}
                        disabled={isOutOfStock}
                      />
                      {/* TODO(logic): toggle this item in selectItems */}

                      <div className="w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                        {item.productVariantId ? (
                          <Badge variant="secondary">Variant</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        &#8369;{moneyFormat.format(item.price)} each
                      </p>

                      {isOutOfStock && (
                        <p className="mt-2 text-xs font-medium text-destructive">
                          Out of stock
                        </p>
                      )}
                      {isLowStock && (
                        <p className="mt-2 text-xs font-medium text-amber-600">
                          Only {item.availableStock} left. Please reduce the quantity.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <CartQuantityInput
                        id={item.id}
                        quantity={item.quantity}
                        availableStock={item.availableStock}
                        onUpdate={updateQuantity}
                      />

                      <div className="text-right sm:w-24">
                        <p className="text-xs text-muted-foreground sm:hidden">Subtotal</p>
                        <p className="text-sm font-medium text-foreground">
                          &#8369;{moneyFormat.format(item.subtotal)}
                        </p>
                      </div>

                      <Button
                        onClick={() => removeItem(item.id, item.quantity)}
                        size="xs"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 data-icon="inline-start" aria-hidden="true" />
                        Remove
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Order summary */}
        {cartItems.length > 0 && (
          <Card className="sticky top-20">
            <CardHeader className="border-b">
              <CardTitle className="text-base">Order summary</CardTitle>
            </CardHeader>

            <CardContent className="gap-0">
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Items selected</span>
                <span className="font-medium">{selectItems.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">&#8369;{moneyFormat.format(subtotal)}</span>
              </div>

              <Separator className="my-3" />

              <p className="text-xs text-muted-foreground">
                Shipping and taxes are calculated at checkout.
              </p>
            </CardContent>

            <CardFooter className="flex-col gap-2 border-t">
              <Button
                onClick={checkout}
                disabled={hasUnavailableItems || selectItems.length === 0}
                size="lg"
                className="w-full"
              >
                Proceed to checkout
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>

              {hasUnavailableItems && (
                <p className="text-xs text-destructive">
                  Some items are unavailable. Remove them to continue.
                </p>
              )}
              {!hasUnavailableItems && selectItems.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Select at least one item to check out.
                </p>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  )
}

// Stock Quantity Input
type CartQuantityInputProps = {
  id: number
  quantity: number
  availableStock: number
  onUpdate: (id: number, quantity: number) => Promise<boolean>
};

const CartQuantityInput = ({ id, quantity, availableStock, onUpdate, }: CartQuantityInputProps) => {
  
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
  }, [id, debouncedValue, onUpdate]);


  return (
    <InputGroup className="text-sm text-center w-30 h-7.5">
      <InputGroupInput 
        type="number"
        min={1}
        className="text-center"
        value={value}
        disabled={availableStock <= 0 || (value >= availableStock)}
        onChange={(event) => {
          setValue(Number(event.target.value));
        }}
      />
      <InputGroupAddon align="inline-start">
        <InputGroupButton onClick={decrement} disabled={availableStock <= 0} variant="secondary"><MinusIcon /></InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={increment} disabled={availableStock <= 0 || (value >= availableStock)} variant="secondary"><PlusIcon /></InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}


// Loading skeleton — mirrors the real cart layout so nothing jumps when data arrives.
export function CartListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="overflow-hidden rounded-lg border bg-card">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b p-4 last:border-b-0">
            <Skeleton className="size-20 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-7.5 w-30" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-6 h-5 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="mt-6 h-10 w-full" />
      </div>
    </div>
  )
}