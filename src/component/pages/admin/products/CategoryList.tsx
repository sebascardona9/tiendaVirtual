import { useState, useMemo } from 'react'
import { orderBy } from 'firebase/firestore'
import type { Category, Subcategory, Product } from '../../../../types/admin'
import {
  checkCategoryDependencies,
  deleteCategory,
  toggleCategoryActive,
} from '../../../../services/categoryService'
import ConfirmDialog    from '../shared/ConfirmDialog'
import AdminModal       from '../shared/AdminModal'
import useCollection    from '../../../../hooks/useCollection'
import AddCategoryForm  from './categories/AddCategoryForm'
import CategoryRow      from './categories/CategoryRow'
import { btnStyle }     from './categories/categoryStyles'

const CategoryList = () => {
  const { data: categories }    = useCollection<Category>('categories', orderBy('createdAt', 'asc'))
  const { data: subcategories } = useCollection<Subcategory>('subcategories', orderBy('createdAt', 'asc'))
  const { data: products }      = useCollection<Product>('products')

  // ── Derived maps ──────────────────────────────────────────────────────────
  const subsByCategory = useMemo(() => {
    const map = new Map<string, Subcategory[]>()
    for (const s of subcategories) {
      if (!map.has(s.categoryId)) map.set(s.categoryId, [])
      map.get(s.categoryId)!.push(s)
    }
    return map
  }, [subcategories])

  const activeSubCountMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of subcategories) {
      if (s.active) map.set(s.categoryId, (map.get(s.categoryId) ?? 0) + 1)
    }
    return map
  }, [subcategories])

  const activeProdCountMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (p.active !== false) map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1)
    }
    return map
  }, [products])

  const activeProdBySubMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (p.active !== false && p.subcategoryId) {
        map.set(p.subcategoryId, (map.get(p.subcategoryId) ?? 0) + 1)
      }
    }
    return map
  }, [products])

  // ── Expand state ──────────────────────────────────────────────────────────
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null)

  // ── Category toggle ───────────────────────────────────────────────────────
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)
  const [toggleWarning, setToggleWarning] = useState<{ cat: Category; subCount: number; prodCount: number } | null>(null)

  const handleToggleRequest = async (cat: Category) => {
    if (cat.active) {
      const deps = await checkCategoryDependencies(cat.id)
      if (deps.activeSubcategories.length > 0 || deps.activeProducts.length > 0) {
        setToggleWarning({ cat, subCount: deps.activeSubcategories.length, prodCount: deps.activeProducts.length })
        return
      }
    }
    setToggleLoading(cat.id)
    try { await toggleCategoryActive(cat.id, cat.active) }
    catch { /* silent */ } finally { setToggleLoading(null) }
  }

  const confirmToggle = async () => {
    if (!toggleWarning) return
    const { cat } = toggleWarning
    setToggleWarning(null)
    setToggleLoading(cat.id)
    try { await toggleCategoryActive(cat.id, cat.active) }
    catch { /* silent */ } finally { setToggleLoading(null) }
  }

  // ── Category delete ───────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget]   = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [blockInfo, setBlockInfo]         = useState<{ cat: Category; subCount: number; prodCount: number } | null>(null)

  const handleDeleteRequest = async (cat: Category) => {
    const deps = await checkCategoryDependencies(cat.id)
    if (deps.activeSubcategories.length > 0 || deps.activeProducts.length > 0) {
      setBlockInfo({ cat, subCount: deps.activeSubcategories.length, prodCount: deps.activeProducts.length })
    } else {
      setDeleteTarget(cat)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try { await deleteCategory(deleteTarget.id); setDeleteTarget(null) }
    catch { /* silent */ } finally { setDeleteLoading(false) }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Categorías
      </h3>

      <AddCategoryForm categories={categories} />

      {categories.length === 0 ? (
        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>No hay categorías aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(cat => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              categories={categories}
              isExpanded={expandedCatId === cat.id}
              activeSubs={activeSubCountMap.get(cat.id) ?? 0}
              subCount={(subsByCategory.get(cat.id) ?? []).length}
              activeProds={activeProdCountMap.get(cat.id) ?? 0}
              toggleLoading={toggleLoading === cat.id}
              subcategories={subsByCategory.get(cat.id) ?? []}
              activeProdBySubMap={activeProdBySubMap}
              onToggleExpand={() => setExpandedCatId(expandedCatId === cat.id ? null : cat.id)}
              onDeleteRequest={handleDeleteRequest}
              onToggleRequest={handleToggleRequest}
            />
          ))}
        </div>
      )}

      {/* ── Category modals ── */}

      {/* Delete — blocked */}
      <AdminModal isOpen={!!blockInfo} onClose={() => setBlockInfo(null)} maxWidth="420px">
        {blockInfo && (
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--vsm-black)' }}>
              No se puede eliminar "{blockInfo.cat.name}"
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '0.5rem' }}>
              Esta categoría tiene dependencias activas:
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--vsm-black)', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              {blockInfo.subCount > 0 && <li>{blockInfo.subCount} subcategoría{blockInfo.subCount > 1 ? 's' : ''} activa{blockInfo.subCount > 1 ? 's' : ''}</li>}
              {blockInfo.prodCount > 0 && <li>{blockInfo.prodCount} producto{blockInfo.prodCount > 1 ? 's' : ''} activo{blockInfo.prodCount > 1 ? 's' : ''}</li>}
            </ul>
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>
              Desactiva o reasigna los productos y subcategorías antes de eliminar la categoría.
            </p>
            <div style={{ textAlign: 'right', marginTop: '1.25rem' }}>
              <button onClick={() => setBlockInfo(null)}
                style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer', padding: '7px 18px' }}>
                Entendido
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete — confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={`¿Marcar "${deleteTarget?.name}" como eliminada? Esta acción ocultará la categoría del catálogo.`}
        loading={deleteLoading}
      />

      {/* Toggle — cascade warning */}
      <AdminModal isOpen={!!toggleWarning} onClose={() => setToggleWarning(null)} maxWidth="420px">
        {toggleWarning && (
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--vsm-black)' }}>
              Desactivar "{toggleWarning.cat.name}"
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '0.5rem' }}>
              Al desactivar esta categoría también se desactivarán:
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--vsm-black)', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              {toggleWarning.subCount > 0 && <li>{toggleWarning.subCount} subcategoría{toggleWarning.subCount > 1 ? 's' : ''} activa{toggleWarning.subCount > 1 ? 's' : ''}</li>}
              {toggleWarning.prodCount > 0 && <li>{toggleWarning.prodCount} producto{toggleWarning.prodCount > 1 ? 's' : ''} activo{toggleWarning.prodCount > 1 ? 's' : ''} (no se desactivan automáticamente)</li>}
            </ul>
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginBottom: '1rem' }}>¿Continuar?</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setToggleWarning(null)}
                style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer', padding: '7px 18px' }}>
                Cancelar
              </button>
              <button onClick={confirmToggle}
                style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', cursor: 'pointer', padding: '7px 18px' }}>
                Desactivar
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default CategoryList
