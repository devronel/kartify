"use client"

import apiClient, { isAxiosError } from "@/lib/api-client";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
};

type CartProviderProps = {
  children: React.ReactNode,
  cartItemCount: number
}

const CartContext = createContext<CartContextType | null>(null)


export function CartProvider({ children, cartItemCount }: CartProviderProps) {
  
  const [cartCount, setCartCount] = useState(cartItemCount);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
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