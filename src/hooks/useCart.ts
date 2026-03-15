import { useState, useEffect } from 'react'
import type { CartItem } from '../types/cart.types'

const STORAGE_KEY = 'vsm_carrito'

const loadFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const agregarItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productoId === item.productoId)
      if (existing) {
        const nuevaCantidad = Math.min(existing.cantidad + item.cantidad, item.stock)
        return prev.map(i =>
          i.productoId === item.productoId ? { ...i, cantidad: nuevaCantidad } : i
        )
      }
      return [...prev, item]
    })
  }

  const quitarItem = (productoId: string) =>
    setItems(prev => prev.filter(i => i.productoId !== productoId))

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad < 1) return
    setItems(prev =>
      prev.map(i => {
        if (i.productoId !== productoId) return i
        return { ...i, cantidad: Math.min(cantidad, i.stock) }
      })
    )
  }

  const vaciarCarrito = () => setItems([])

  const estaEnCarrito = (productoId: string) =>
    items.some(i => i.productoId === productoId)

  const totalItems  = items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrecio = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)

  return {
    items, totalItems, totalPrecio,
    agregarItem, quitarItem, actualizarCantidad, vaciarCarrito, estaEnCarrito,
  }
}
