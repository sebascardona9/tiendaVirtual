import {
  collection, doc, getDocs, updateDoc, addDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import type { Product, ColorFormData } from '../types/admin'

export interface ColorDependencies {
  activeProducts: Product[]
}

/** Returns active products that use this color */
export async function checkColorDependencies(colorId: string): Promise<ColorDependencies> {
  const prodSnap = await getDocs(query(
    collection(db, 'products'),
    where('colorId', '==', colorId),
    where('active', '==', true),
  ))
  return {
    activeProducts: prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)),
  }
}

/** Soft-delete: sets activo = false. Call only after verifying no active dependencies. */
export async function deleteColor(colorId: string): Promise<void> {
  await updateDoc(doc(db, 'colores', colorId), { activo: false })
}

/** Toggles color activo state. */
export async function toggleColorActive(colorId: string, currentlyActive: boolean): Promise<void> {
  await updateDoc(doc(db, 'colores', colorId), { activo: !currentlyActive })
}

/** Creates or updates a color. If id is provided → update; otherwise → create. */
export async function saveColor(data: ColorFormData, id?: string): Promise<void> {
  if (id) {
    await updateDoc(doc(db, 'colores', id), {
      nombre:     data.nombre.trim(),
      codigoHex:  data.codigoHex,
      activo:     data.activo,
    })
  } else {
    await addDoc(collection(db, 'colores'), {
      nombre:     data.nombre.trim(),
      codigoHex:  data.codigoHex,
      activo:     data.activo,
      creadoEn:   serverTimestamp(),
    })
  }
}
