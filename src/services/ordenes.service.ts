import { collection, addDoc, updateDoc, doc, serverTimestamp, runTransaction } from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import type { CartItem, CheckoutState } from '../types/cart.types'
import type { EstadoOrden } from '../types/orden.types'

export const crearOrden = async (
  form: CheckoutState,
  items: CartItem[],
  total: number,
): Promise<string> => {
  const settingsRef = doc(db, 'settings', 'general')
  const siguiente = await runTransaction(db, async (tx) => {
    const snap = await tx.get(settingsRef)
    const actual = (snap.data()?.ultimoNumeroPedido as number) ?? 0
    const next = actual + 1
    tx.update(settingsRef, { ultimoNumeroPedido: next })
    return next
  })
  const numeroOrden = 'PED-' + String(siguiente).padStart(6, '0')
  const t = form.esParaTercero

  await addDoc(collection(db, 'ordenes'), {
    numeroOrden,
    comprador: { nombre: form.nombre, email: form.email, telefono: form.telefono },
    envio: {
      esParaTercero:       t,
      nombreRecibe:        t ? form.terceroNombre              : form.nombre,
      telefonoRecibe:      t ? form.terceroTelefono            : form.telefono,
      paisCodigo:          'CO',
      paisNombre:          'Colombia',
      departamentoCodigo:  t ? form.terceroDepartamentoCodigo  : form.departamentoCodigo,
      departamentoNombre:  t ? form.terceroDepartamentoNombre  : form.departamentoNombre,
      municipioCodigo:     t ? form.terceroMunicipioCodigo     : form.municipioCodigo,
      municipioNombre:     t ? form.terceroMunicipioNombre     : form.municipioNombre,
      direccion:           t ? form.terceroDireccion           : form.direccion,
      barrio:             (t ? form.terceroBarrio              : form.barrio)       || null,
      indicaciones:       (t ? form.terceroIndicaciones        : form.indicaciones) || null,
    },
    items: items.map(i => ({
      productoId: i.productoId,
      nombre:     i.nombre,
      precio:     i.precio,
      cantidad:   i.cantidad,
      imagen:     i.imagen,
      aroma:      i.aroma,
      color:      i.color,
      colorHex:   i.colorHex,
    })),
    total,
    estado:   'pendiente',
    creadoEn: serverTimestamp(),
  })

  return numeroOrden
}

export const actualizarEstadoOrden = (id: string, estado: EstadoOrden) =>
  updateDoc(doc(db, 'ordenes', id), { estado })
