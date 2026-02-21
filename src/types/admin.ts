import type { Timestamp } from 'firebase/firestore'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  imageUrl: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Category {
  id: string
  name: string
  createdAt: Timestamp
}

export interface SocialLinks {
  instagram: string
  facebook: string
  whatsapp: string
  tiktok: string
}

export interface StoreSettings {
  storeName: string
  logoUrl: string
  description: string
  email: string
  phone: string
  social: SocialLinks
  updatedAt: Timestamp
}

export interface ProductFormData {
  name: string
  description: string
  price: number | ''
  stock: number | ''
  categoryId: string
  imageUrl: string
}

export interface SettingsFormData {
  storeName: string
  description: string
  email: string
  phone: string
  social: SocialLinks
}

export type AdminSection = 'dashboard' | 'productos' | 'configuracion'
export type ProductsTab  = 'productos' | 'categorias'
