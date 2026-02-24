import type { Timestamp } from 'firebase/firestore'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  categoryName: string
  subcategoryId?: string
  subcategoryName?: string
  imageUrl: string
  images?: string[]   // array de 1-5 URLs; si existe toma precedencia sobre imageUrl
  aroma?: string
  active: boolean     // backwards compat: filter with p.active !== false
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  createdAt: Timestamp
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  categoryId: string
  categoryName: string
  active: boolean
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
  subcategoryId: string
  imageUrl: string  // kept for backwards compat — always mirrors images[0]
  active: boolean
}

export interface CategoryFormData {
  name: string
  description: string
}

export interface SubcategoryFormData {
  name: string
  description: string
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
