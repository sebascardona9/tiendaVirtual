import {
  collection, doc, getDocs, updateDoc,
  query, where, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import type { Subcategory, Product } from '../types/admin'

export interface CategoryDependencies {
  activeSubcategories: Subcategory[]
  activeProducts: Product[]
}

/** Returns active subcategories and products that belong to this category */
export async function checkCategoryDependencies(categoryId: string): Promise<CategoryDependencies> {
  const [subSnap, prodSnap] = await Promise.all([
    getDocs(query(
      collection(db, 'subcategories'),
      where('categoryId', '==', categoryId),
      where('active', '==', true),
    )),
    getDocs(query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId),
      where('active', '==', true),
    )),
  ])

  return {
    activeSubcategories: subSnap.docs.map(d => ({ id: d.id, ...d.data() } as Subcategory)),
    activeProducts:      prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)),
  }
}

/** Soft-delete: sets active = false. Call only after verifying no active dependencies. */
export async function deleteCategory(categoryId: string): Promise<void> {
  await updateDoc(doc(db, 'categories', categoryId), { active: false })
}

/**
 * Toggles category active state.
 * When deactivating: cascades to all subcategories of this category (sets them active: false).
 * When activating: only activates the category itself (subcategories remain as-is).
 */
export async function toggleCategoryActive(categoryId: string, currentlyActive: boolean): Promise<void> {
  const batch = writeBatch(db)

  batch.update(doc(db, 'categories', categoryId), { active: !currentlyActive })

  if (currentlyActive) {
    // Deactivate all subcategories of this category
    const subSnap = await getDocs(query(
      collection(db, 'subcategories'),
      where('categoryId', '==', categoryId),
    ))
    subSnap.docs.forEach(d => batch.update(d.ref, { active: false }))
  }

  await batch.commit()
}

/**
 * Renames a category and propagates the new name to all subcategories and products
 * that reference this category (categoryName field).
 */
export async function updateCategoryName(categoryId: string, newName: string): Promise<void> {
  const batch = writeBatch(db)

  batch.update(doc(db, 'categories', categoryId), {
    name: newName,
    updatedAt: serverTimestamp(),
  })

  const [subSnap, prodSnap] = await Promise.all([
    getDocs(query(collection(db, 'subcategories'), where('categoryId', '==', categoryId))),
    getDocs(query(collection(db, 'products'), where('categoryId', '==', categoryId))),
  ])

  subSnap.docs.forEach(d => batch.update(d.ref, { categoryName: newName }))
  prodSnap.docs.forEach(d => batch.update(d.ref, { categoryName: newName }))

  await batch.commit()
}
