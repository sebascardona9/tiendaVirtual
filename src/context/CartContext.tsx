import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useCart } from '../hooks/useCart'

type CartContextValue = ReturnType<typeof useCart>

const CartContext = createContext<CartContextValue | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCart()
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext debe usarse dentro de CartProvider')
  return ctx
}
