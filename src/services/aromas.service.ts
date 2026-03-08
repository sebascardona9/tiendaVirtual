import {
  collection, doc, getDocs, updateDoc, addDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import type { Product, AromaFormData } from '../types/admin'

export interface AromaDependencies {
  activeProducts: Product[]
}

/** Returns active products that use this aroma */
export async function checkAromaDependencies(aromaId: string): Promise<AromaDependencies> {
  const prodSnap = await getDocs(query(
    collection(db, 'products'),
    where('aromaId', '==', aromaId),
    where('active', '==', true),
  ))
  return {
    activeProducts: prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)),
  }
}

/** Soft-delete: sets activo = false. Call only after verifying no active dependencies. */
export async function deleteAroma(aromaId: string): Promise<void> {
  await updateDoc(doc(db, 'aromas', aromaId), { activo: false })
}

/** Toggles aroma activo state. */
export async function toggleAromaActive(aromaId: string, currentlyActive: boolean): Promise<void> {
  await updateDoc(doc(db, 'aromas', aromaId), { activo: !currentlyActive })
}

/** Creates or updates an aroma. If id is provided → update; otherwise → create. */
export async function saveAroma(data: AromaFormData, id?: string): Promise<void> {
  if (id) {
    await updateDoc(doc(db, 'aromas', id), {
      nombre:      data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      activo:      data.activo,
    })
  } else {
    await addDoc(collection(db, 'aromas'), {
      nombre:      data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      activo:      data.activo,
      creadoEn:    serverTimestamp(),
    })
  }
}
