import type { CheckoutState } from '../types/cart.types'

export const validateCheckout = (form: CheckoutState): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!form.nombre.trim())
    errors.nombre = 'El nombre es requerido'
  if (!form.email.trim())
    errors.email = 'El correo es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Ingresa un correo válido'
  if (!form.telefono.trim())
    errors.telefono = 'El teléfono es requerido'
  else if (!/^\d{7,10}$/.test(form.telefono.replace(/\s/g, '')))
    errors.telefono = 'Ingresa entre 7 y 10 dígitos'

  if (!form.departamentoCodigo) errors.departamento = 'Selecciona un departamento'
  if (!form.municipioCodigo)    errors.municipio    = 'Selecciona un municipio'
  if (!form.direccion.trim())   errors.direccion    = 'La dirección es requerida'
  else if (form.direccion.trim().length < 10)
    errors.direccion = 'La dirección debe tener al menos 10 caracteres'

  if (form.esParaTercero) {
    if (!form.terceroNombre.trim())
      errors.terceroNombre = 'El nombre de quien recibe es requerido'
    if (!form.terceroTelefono.trim())
      errors.terceroTelefono = 'El teléfono de quien recibe es requerido'
    if (!form.terceroDepartamentoCodigo)
      errors.terceroDepartamento = 'Selecciona un departamento'
    if (!form.terceroMunicipioCodigo)
      errors.terceroMunicipio = 'Selecciona un municipio'
    if (!form.terceroDireccion.trim())
      errors.terceroDireccion = 'La dirección es requerida'
    else if (form.terceroDireccion.trim().length < 10)
      errors.terceroDireccion = 'La dirección debe tener al menos 10 caracteres'
  }

  return errors
}
