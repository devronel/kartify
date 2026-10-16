"use client"

import apiClient, { isAxiosError } from "@/lib/api-client";
import { CartDetails, CartResponse } from "@/types/cart";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>
  cartItems: CartDetails[]
  setCartItems: React.Dispatch<React.SetStateAction<CartDetails[]>>
  getCartItems: () => Promise<void>
  hasUnavailableItems: boolean
  setHasUnavailableItems: React.Dispatch<React.SetStateAction<boolean>>
};

type CartProviderProps = {
  children: React.ReactNode,
  cartItemCount: number,
  cart: CartResponse | null
}

const CartContext = createContext<CartContextType | null>(null)


export function CartProvider({ children, cartItemCount, cart }: CartProviderProps) {
  
  const [cartCount, setCartCount] = useState(cartItemCount);
  const [hasUnavailableItems, setHasUnavailableItems] = useState<boolean>(cart?.hasUnavailableItems ?? false)
  const [cartItems, setCartItems] = useState<CartDetails[]>(cart?.items ?? [])

  const getCartItems = async () => {

    try {
      const res = await apiClient('/api/cart');
        setCartItems(res.data.items);
        setHasUnavailableItems(res.data.hasUnavailableItems)
    } catch (error: unknown) {

      if(isAxiosError(error)){
        console.error('Failed to update cart context:', error);
      }

    }

  }

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      setCartCount, 
      cartItems, 
      setCartItems, 
      getCartItems, 
      hasUnavailableItems,
      setHasUnavailableItems
    }}>
      {children}
    </CartContext.Provider>
  );

}


export function useCart() {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;

}