export interface CartItem {
  productoId: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
  stock: number
  aroma: string | null
  color: string | null
  colorHex: string | null
}

export interface CheckoutState {
  // Bloque 1 — comprador
  nombre: string
  email: string
  telefono: string
  // Bloque 2 — envío directo
  esParaTercero: boolean
  departamentoCodigo: string
  departamentoNombre: string
  municipioCodigo: string
  municipioNombre: string
  direccion: string
  barrio: string
  indicaciones: string
  // Tercero
  terceroNombre: string
  terceroTelefono: string
  terceroDepartamentoCodigo: string
  terceroDepartamentoNombre: string
  terceroMunicipioCodigo: string
  terceroMunicipioNombre: string
  terceroDireccion: string
  terceroBarrio: string
  terceroIndicaciones: string
}
