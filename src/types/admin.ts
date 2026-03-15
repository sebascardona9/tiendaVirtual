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
  images?: string[]      // array de 1-5 URLs; si existe toma precedencia sobre imageUrl
  active: boolean        // backwards compat: filter with p.active !== false
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Aroma {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
  creadoEn: Timestamp
}

export interface Color {
  id: string
  nombre: string
  codigoHex?: string
  activo: boolean
  creadoEn: Timestamp
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
  tiktok: string
}

export interface StoreSettings {
  storeName: string
  logoUrl: string
  description: string
  email: string
  phone: string
  address?: string
  social: SocialLinks
  heroVideoURL?: string | null
  heroEyebrow?: string
  heroTitulo?: string
  heroSubtitulo?: string
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

export interface AromaFormData {
  nombre: string
  descripcion: string
  activo: boolean
}

export interface ColorFormData {
  nombre: string
  codigoHex: string
  activo: boolean
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
  address: string
  social: SocialLinks
}

export interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: Timestamp
  read: boolean
}

export type AdminSection = 'dashboard' | 'productos' | 'configuracion' | 'mensajes' | 'ordenes'
export type ProductsTab  = 'productos' | 'categorias' | 'atributos'
