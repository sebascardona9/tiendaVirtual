import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { crearOrden } from '../services/ordenes.service'
import { validateCheckout } from './useCheckoutValidacion'
import type { CheckoutState } from '../types/cart.types'

const INITIAL: CheckoutState = {
  nombre: '', email: '', telefono: '',
  esParaTercero: false,
  departamentoCodigo: '', departamentoNombre: '',
  municipioCodigo: '',    municipioNombre: '',
  direccion: '', barrio: '', indicaciones: '',
  terceroNombre: '', terceroTelefono: '',
  terceroDepartamentoCodigo: '', terceroDepartamentoNombre: '',
  terceroMunicipioCodigo: '',    terceroMunicipioNombre: '',
  terceroDireccion: '', terceroBarrio: '', terceroIndicaciones: '',
}

export const useCheckout = () => {
  const { items, totalPrecio, vaciarCarrito } = useCartContext()
  const navigate = useNavigate()
  const [form,    setForm]    = useState<CheckoutState>(INITIAL)
  const [errors,  setErrors]  = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setField = (field: keyof CheckoutState, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const setDepartamento = (codigo: string, nombre: string) =>
    setForm(prev => ({ ...prev, departamentoCodigo: codigo, departamentoNombre: nombre, municipioCodigo: '', municipioNombre: '' }))

  const setMunicipio = (codigo: string, nombre: string) =>
    setForm(prev => ({ ...prev, municipioCodigo: codigo, municipioNombre: nombre }))

  const setTerceroDepartamento = (codigo: string, nombre: string) =>
    setForm(prev => ({ ...prev, terceroDepartamentoCodigo: codigo, terceroDepartamentoNombre: nombre, terceroMunicipioCodigo: '', terceroMunicipioNombre: '' }))

  const setTerceroMunicipio = (codigo: string, nombre: string) =>
    setForm(prev => ({ ...prev, terceroMunicipioCodigo: codigo, terceroMunicipioNombre: nombre }))

  const handleSubmit = async () => {
    const errs = validateCheckout(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const numeroOrden = await crearOrden(form, items, totalPrecio)
      vaciarCarrito()
      navigate('/orden-confirmada', { state: { numeroOrden, telefono: form.telefono } })
    } catch (err) {
      console.error('[useCheckout] Error guardando orden:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    form, errors, loading,
    setField, setDepartamento, setMunicipio,
    setTerceroDepartamento, setTerceroMunicipio,
    handleSubmit,
  }
}
