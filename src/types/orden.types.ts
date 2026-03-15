import type { Timestamp } from 'firebase/firestore'

export type EstadoOrden = 'pendiente' | 'enviado' | 'entregado' | 'cancelado'

export interface OrdenComprador {
  nombre: string
  email: string
  telefono: string
}

export interface OrdenEnvio {
  esParaTercero: boolean
  nombreRecibe: string
  telefonoRecibe: string
  paisCodigo: string
  paisNombre: string
  departamentoCodigo: string
  departamentoNombre: string
  municipioCodigo: string
  municipioNombre: string
  direccion: string
  barrio: string | null
  indicaciones: string | null
}

export interface OrdenItem {
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  imagen: string
  aroma: string | null
  color: string | null
  colorHex: string | null
}

export interface Orden {
  id: string
  numeroOrden: string
  comprador: OrdenComprador
  envio: OrdenEnvio
  items: OrdenItem[]
  total: number
  estado: EstadoOrden
  creadoEn: Timestamp
}
