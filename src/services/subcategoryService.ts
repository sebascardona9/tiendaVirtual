import {
  collection, doc, getDocs, updateDoc,
  query, where, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import type { Product } from '../types/admin'

export interface SubcategoryDependencies {
  activeProducts: Product[]
}

/** Returns active products that belong to this subcategory */
export async function checkSubcategoryDependencies(subcategoryId: string): Promise<SubcategoryDependencies> {
  const prodSnap = await getDocs(query(
    collection(db, 'products'),
    where('subcategoryId', '==', subcategoryId),
    where('active', '==', true),
  ))

  return {
    activeProducts: prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)),
  }
}

/** Soft-delete: sets active = false. Call only after verifying no active dependencies. */
export async function deleteSubcategory(subcategoryId: string): Promise<void> {
  await updateDoc(doc(db, 'subcategories', subcategoryId), { active: false })
}

/** Toggles subcategory active state (no cascade — products keep their subcategoryId). */
export async function toggleSubcategoryActive(subcategoryId: string, currentlyActive: boolean): Promise<void> {
  await updateDoc(doc(db, 'subcategories', subcategoryId), { active: !currentlyActive })
}

/**
 * Renames a subcategory and propagates the new name to all products
 * that reference this subcategory (subcategoryName field).
 */
export async function updateSubcategoryName(subcategoryId: string, newName: string): Promise<void> {
  const batch = writeBatch(db)

  batch.update(doc(db, 'subcategories', subcategoryId), {
    name: newName,
    updatedAt: serverTimestamp(),
  })

  const prodSnap = await getDocs(query(
    collection(db, 'products'),
    where('subcategoryId', '==', subcategoryId),
  ))

  prodSnap.docs.forEach(d => batch.update(d.ref, { subcategoryName: newName }))

  await batch.commit()
}
