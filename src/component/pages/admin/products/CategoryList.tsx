import React, { useState, useMemo } from 'react'
import {
  addDoc, updateDoc,
  collection, doc, serverTimestamp, orderBy,
} from 'firebase/firestore'
import { db } from '../../../../firebase/firebase.config'
import type { Category, Subcategory, Product } from '../../../../types/admin'
import {
  checkCategoryDependencies,
  deleteCategory,
  toggleCategoryActive,
  updateCategoryName,
} from '../../../../services/categoryService'
import {
  checkSubcategoryDependencies,
  deleteSubcategory,
  toggleSubcategoryActive,
  updateSubcategoryName,
} from '../../../../services/subcategoryService'
import ConfirmDialog from '../shared/ConfirmDialog'
import AdminModal from '../shared/AdminModal'
import useCollection from '../../../../hooks/useCollection'
import ToggleSwitch from '../../../../ui/shared/ToggleSwitch'
import { onFocusBrand, onBlurGray } from '../../../../styles/formStyles'

// ─── Styles ──────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  padding: '7px 10px',
  border: '1px solid var(--vsm-gray)',
  borderRadius: 'var(--vsm-radius-sm)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  flex: 1,
  color: 'var(--vsm-black)',
  backgroundColor: 'var(--vsm-white)',
}

const btnStyle: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: '4px',
  border: 'none',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}

// ─── Component ───────────────────────────────────────────────────────────────
const CategoryList = () => {
  const { data: categories }    = useCollection<Category>('categories', orderBy('createdAt', 'asc'))
  const { data: subcategories } = useCollection<Subcategory>('subcategories', orderBy('createdAt', 'asc'))
  const { data: products }      = useCollection<Product>('products')

  // ── Derived maps ─────────────────────────────────────────────────────────
  const subsByCategory = useMemo<Map<string, Subcategory[]>>(() => {
    const map = new Map<string, Subcategory[]>()
    for (const s of subcategories) {
      if (!map.has(s.categoryId)) map.set(s.categoryId, [])
      map.get(s.categoryId)!.push(s)
    }
    return map
  }, [subcategories])

  const activeSubCountMap = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>()
    for (const s of subcategories) {
      if (s.active) map.set(s.categoryId, (map.get(s.categoryId) ?? 0) + 1)
    }
    return map
  }, [subcategories])

  const activeProdCountMap = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (p.active !== false) map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1)
    }
    return map
  }, [products])

  const activeProdBySubMap = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (p.active !== false && p.subcategoryId) {
        map.set(p.subcategoryId, (map.get(p.subcategoryId) ?? 0) + 1)
      }
    }
    return map
  }, [products])

  // ── Category add form ────────────────────────────────────────────────────
  const [newName, setNewName]       = useState('')
  const [newDesc, setNewDesc]       = useState('')
  const [addError, setAddError]     = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)

  const handleAddCategory = async () => {
    const trimmed = newName.trim()
    if (!trimmed) { setAddError('El nombre no puede estar vacío.'); return }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setAddError('Ya existe una categoría con ese nombre.'); return
    }
    setAddLoading(true); setAddError(null)
    try {
      await addDoc(collection(db, 'categories'), {
        name: trimmed,
        description: newDesc.trim(),
        active: true,
        createdAt: serverTimestamp(),
      })
      setNewName(''); setNewDesc('')
    } catch {
      setAddError('Error al agregar. Intenta de nuevo.')
    } finally {
      setAddLoading(false)
    }
  }

  // ── Category edit ────────────────────────────────────────────────────────
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editCatName, setEditCatName]   = useState('')
  const [editCatDesc, setEditCatDesc]   = useState('')
  const [editCatError, setEditCatError] = useState<string | null>(null)
  const [editCatLoading, setEditCatLoading] = useState(false)

  const startEditCat = (cat: Category) => {
    setEditingCatId(cat.id)
    setEditCatName(cat.name)
    setEditCatDesc(cat.description ?? '')
    setEditCatError(null)
  }

  const handleEditCat = async (cat: Category) => {
    const trimmed = editCatName.trim()
    if (!trimmed) { setEditCatError('El nombre no puede estar vacío.'); return }
    if (categories.some(c => c.id !== cat.id && c.name.toLowerCase() === trimmed.toLowerCase())) {
      setEditCatError('Ya existe una categoría con ese nombre.'); return
    }
    setEditCatLoading(true); setEditCatError(null)
    try {
      if (trimmed !== cat.name) {
        await updateCategoryName(cat.id, trimmed)
      }
      if (editCatDesc.trim() !== (cat.description ?? '')) {
        await updateDoc(doc(db, 'categories', cat.id), { description: editCatDesc.trim() })
      }
      setEditingCatId(null)
    } catch {
      setEditCatError('Error al guardar.')
    } finally {
      setEditCatLoading(false)
    }
  }

  // ── Category delete ──────────────────────────────────────────────────────
  const [deleteCatTarget, setDeleteCatTarget]   = useState<Category | null>(null)
  const [deleteCatLoading, setDeleteCatLoading] = useState(false)
  const [blockInfo, setBlockInfo]               = useState<{ cat: Category; subCount: number; prodCount: number } | null>(null)

  const handleDeleteCatClick = async (cat: Category) => {
    const deps = await checkCategoryDependencies(cat.id)
    if (deps.activeSubcategories.length > 0 || deps.activeProducts.length > 0) {
      setBlockInfo({ cat, subCount: deps.activeSubcategories.length, prodCount: deps.activeProducts.length })
    } else {
      setDeleteCatTarget(cat)
    }
  }

  const handleDeleteCat = async () => {
    if (!deleteCatTarget) return
    setDeleteCatLoading(true)
    try { await deleteCategory(deleteCatTarget.id); setDeleteCatTarget(null) }
    catch { /* silent */ } finally { setDeleteCatLoading(false) }
  }

  // ── Category toggle ──────────────────────────────────────────────────────
  const [toggleWarning, setToggleWarning] = useState<{ cat: Category; subCount: number; prodCount: number } | null>(null)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  const handleToggleCat = async (cat: Category) => {
    if (cat.active) {
      // Warn if there are active deps
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

  const confirmToggleCat = async () => {
    if (!toggleWarning) return
    const { cat } = toggleWarning
    setToggleWarning(null)
    setToggleLoading(cat.id)
    try { await toggleCategoryActive(cat.id, cat.active) }
    catch { /* silent */ } finally { setToggleLoading(null) }
  }

  // ── Expanded rows ────────────────────────────────────────────────────────
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null)

  // ── Subcategory add form ─────────────────────────────────────────────────
  const [newSubName, setNewSubName]       = useState<Record<string, string>>({})
  const [newSubDesc, setNewSubDesc]       = useState<Record<string, string>>({})
  const [addSubError, setAddSubError]     = useState<Record<string, string>>({})
  const [addSubLoading, setAddSubLoading] = useState<Record<string, boolean>>({})

  const handleAddSub = async (cat: Category) => {
    const name = (newSubName[cat.id] ?? '').trim()
    if (!name) { setAddSubError(p => ({ ...p, [cat.id]: 'El nombre no puede estar vacío.' })); return }
    const sibs = subsByCategory.get(cat.id) ?? []
    if (sibs.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setAddSubError(p => ({ ...p, [cat.id]: 'Ya existe una subcategoría con ese nombre.' })); return
    }
    setAddSubLoading(p => ({ ...p, [cat.id]: true }))
    setAddSubError(p => ({ ...p, [cat.id]: '' }))
    try {
      await addDoc(collection(db, 'subcategories'), {
        name,
        description: (newSubDesc[cat.id] ?? '').trim(),
        categoryId: cat.id,
        categoryName: cat.name,
        active: true,
        createdAt: serverTimestamp(),
      })
      setNewSubName(p => ({ ...p, [cat.id]: '' }))
      setNewSubDesc(p => ({ ...p, [cat.id]: '' }))
    } catch {
      setAddSubError(p => ({ ...p, [cat.id]: 'Error al agregar.' }))
    } finally {
      setAddSubLoading(p => ({ ...p, [cat.id]: false }))
    }
  }

  // ── Subcategory edit ─────────────────────────────────────────────────────
  const [editingSubId, setEditingSubId]     = useState<string | null>(null)
  const [editSubName, setEditSubName]       = useState('')
  const [editSubDesc, setEditSubDesc]       = useState('')
  const [editSubError, setEditSubError]     = useState<string | null>(null)
  const [editSubLoading, setEditSubLoading] = useState(false)

  const startEditSub = (sub: Subcategory) => {
    setEditingSubId(sub.id)
    setEditSubName(sub.name)
    setEditSubDesc(sub.description ?? '')
    setEditSubError(null)
  }

  const handleEditSub = async (sub: Subcategory) => {
    const trimmed = editSubName.trim()
    if (!trimmed) { setEditSubError('El nombre no puede estar vacío.'); return }
    const sibs = subsByCategory.get(sub.categoryId) ?? []
    if (sibs.some(s => s.id !== sub.id && s.name.toLowerCase() === trimmed.toLowerCase())) {
      setEditSubError('Ya existe una subcategoría con ese nombre.'); return
    }
    setEditSubLoading(true); setEditSubError(null)
    try {
      if (trimmed !== sub.name) {
        await updateSubcategoryName(sub.id, trimmed)
      }
      if (editSubDesc.trim() !== (sub.description ?? '')) {
        await updateDoc(doc(db, 'subcategories', sub.id), { description: editSubDesc.trim() })
      }
      setEditingSubId(null)
    } catch {
      setEditSubError('Error al guardar.')
    } finally {
      setEditSubLoading(false)
    }
  }

  // ── Subcategory delete ───────────────────────────────────────────────────
  const [deleteSubTarget, setDeleteSubTarget]   = useState<Subcategory | null>(null)
  const [deleteSubLoading, setDeleteSubLoading] = useState(false)
  const [blockSubInfo, setBlockSubInfo]         = useState<{ sub: Subcategory; prodCount: number } | null>(null)

  const handleDeleteSubClick = async (sub: Subcategory) => {
    const deps = await checkSubcategoryDependencies(sub.id)
    if (deps.activeProducts.length > 0) {
      setBlockSubInfo({ sub, prodCount: deps.activeProducts.length })
    } else {
      setDeleteSubTarget(sub)
    }
  }

  const handleDeleteSub = async () => {
    if (!deleteSubTarget) return
    setDeleteSubLoading(true)
    try { await deleteSubcategory(deleteSubTarget.id); setDeleteSubTarget(null) }
    catch { /* silent */ } finally { setDeleteSubLoading(false) }
  }

  // ── Subcategory toggle ───────────────────────────────────────────────────
  const [toggleSubLoading, setToggleSubLoading] = useState<string | null>(null)

  const handleToggleSub = async (sub: Subcategory) => {
    setToggleSubLoading(sub.id)
    try { await toggleSubcategoryActive(sub.id, sub.active) }
    catch { /* silent */ } finally { setToggleSubLoading(null) }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Categorías
      </h3>

      {/* ── Add category form ── */}
      <div style={{ backgroundColor: 'var(--vsm-bg)', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--vsm-gray)' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--vsm-gray-mid)', marginBottom: '0.6rem' }}>Nueva categoría</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            value={newName}
            onChange={e => { setNewName(e.target.value); setAddError(null) }}
            onKeyDown={e => { if (e.key === 'Enter') handleAddCategory() }}
            placeholder="Nombre *"
            style={{ ...inputStyle, minWidth: 160 }}
            onFocus={onFocusBrand}
            onBlur={onBlurGray}
          />
          <input
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Descripción (opcional)"
            style={{ ...inputStyle, minWidth: 200 }}
            onFocus={onFocusBrand}
            onBlur={onBlurGray}
          />
          <button
            onClick={handleAddCategory}
            disabled={addLoading}
            style={{
              ...btnStyle,
              backgroundColor: 'var(--vsm-brand)', color: '#fff',
              padding: '7px 16px', opacity: addLoading ? 0.75 : 1,
              cursor: addLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {addLoading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
        {addError && <p style={{ color: 'var(--vsm-error)', fontSize: '12px', marginTop: '0.4rem' }}>{addError}</p>}
      </div>

      {/* ── Category list ── */}
      {categories.length === 0 ? (
        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>No hay categorías aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(cat => {
            const isExpanded = expandedCatId === cat.id
            const isEditing  = editingCatId === cat.id
            const catSubs    = subsByCategory.get(cat.id) ?? []
            const subCount   = catSubs.length
            const activeSubs = activeSubCountMap.get(cat.id) ?? 0
            const activeProds = activeProdCountMap.get(cat.id) ?? 0

            return (
              <div
                key={cat.id}
                style={{
                  border: '1px solid var(--vsm-gray)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  opacity: cat.active ? 1 : 0.65,
                }}
              >
                {/* ── Category row ── */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '10px 12px',
                  backgroundColor: 'var(--vsm-white)',
                }}>
                  {isEditing ? (
                    <>
                      <input
                        value={editCatName}
                        onChange={e => { setEditCatName(e.target.value); setEditCatError(null) }}
                        onKeyDown={e => { if (e.key === 'Enter') handleEditCat(cat) }}
                        style={{ ...inputStyle, maxWidth: 200 }}
                        onFocus={onFocusBrand}
                        onBlur={onBlurGray}
                        autoFocus
                      />
                      <input
                        value={editCatDesc}
                        onChange={e => setEditCatDesc(e.target.value)}
                        placeholder="Descripción"
                        style={{ ...inputStyle, maxWidth: 220 }}
                        onFocus={onFocusBrand}
                        onBlur={onBlurGray}
                      />
                      {editCatError && <span style={{ color: 'var(--vsm-error)', fontSize: '11px' }}>{editCatError}</span>}
                      <button onClick={() => handleEditCat(cat)} disabled={editCatLoading}
                        style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', opacity: editCatLoading ? 0.75 : 1, cursor: editCatLoading ? 'not-allowed' : 'pointer' }}>
                        {editCatLoading ? '...' : 'Guardar'}
                      </button>
                      <button onClick={() => setEditingCatId(null)}
                        style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Expand toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '12px', color: 'var(--vsm-gray-mid)' }}
                        title={isExpanded ? 'Colapsar' : 'Expandir subcategorías'}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>

                      {/* Name + description */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--vsm-black)' }}>{cat.name}</span>
                        {cat.description && (
                          <span style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', marginLeft: '8px' }}>{cat.description}</span>
                        )}
                      </div>

                      {/* Counters */}
                      <span style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>
                        {activeSubs}/{subCount} subs · {activeProds} prods
                      </span>

                      {/* Active toggle */}
                      <ToggleSwitch
                        active={cat.active}
                        onChange={() => handleToggleCat(cat)}
                        disabled={toggleLoading === cat.id}
                      />

                      {/* Actions */}
                      <button onClick={() => startEditCat(cat)}
                        style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer' }}>
                        Editar
                      </button>
                      <button onClick={() => handleDeleteCatClick(cat)}
                        style={{ ...btnStyle, backgroundColor: 'var(--vsm-error-bg)', color: 'var(--vsm-error)', border: '1px solid var(--vsm-error-border)', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>

                {/* ── Expanded subcategory panel ── */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--vsm-gray)', backgroundColor: 'var(--vsm-bg)', padding: '0.75rem 1rem' }}>
                    {/* Subcategory table */}
                    {catSubs.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginBottom: '0.75rem' }}>Sin subcategorías.</p>
                    ) : (
                      <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--vsm-gray)' }}>
                              {['Nombre','Descripción','Prods activos','Activo','Acciones'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '5px 8px', fontWeight: 700, color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {catSubs.map(sub => {
                              const isEditingSub = editingSubId === sub.id
                              const subProds = activeProdBySubMap.get(sub.id) ?? 0
                              return (
                                <tr key={sub.id} style={{ borderBottom: '1px solid var(--vsm-gray)', opacity: sub.active ? 1 : 0.6 }}>
                                  {isEditingSub ? (
                                    <td colSpan={5} style={{ padding: '6px 8px' }}>
                                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <input
                                          value={editSubName}
                                          onChange={e => { setEditSubName(e.target.value); setEditSubError(null) }}
                                          onKeyDown={e => { if (e.key === 'Enter') handleEditSub(sub) }}
                                          placeholder="Nombre"
                                          style={{ ...inputStyle, maxWidth: 180 }}
                                          onFocus={onFocusBrand}
                                          onBlur={onBlurGray}
                                          autoFocus
                                        />
                                        <input
                                          value={editSubDesc}
                                          onChange={e => setEditSubDesc(e.target.value)}
                                          placeholder="Descripción"
                                          style={{ ...inputStyle, maxWidth: 200 }}
                                          onFocus={onFocusBrand}
                                          onBlur={onBlurGray}
                                        />
                                        {editSubError && <span style={{ color: 'var(--vsm-error)', fontSize: '11px' }}>{editSubError}</span>}
                                        <button onClick={() => handleEditSub(sub)} disabled={editSubLoading}
                                          style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', opacity: editSubLoading ? 0.75 : 1, cursor: editSubLoading ? 'not-allowed' : 'pointer' }}>
                                          {editSubLoading ? '...' : 'Guardar'}
                                        </button>
                                        <button onClick={() => setEditingSubId(null)}
                                          style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer' }}>
                                          Cancelar
                                        </button>
                                      </div>
                                    </td>
                                  ) : (
                                    <>
                                      <td style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--vsm-black)' }}>{sub.name}</td>
                                      <td style={{ padding: '6px 8px', color: 'var(--vsm-gray-mid)' }}>{sub.description ?? '—'}</td>
                                      <td style={{ padding: '6px 8px', color: 'var(--vsm-gray-mid)' }}>{subProds}</td>
                                      <td style={{ padding: '6px 8px' }}>
                                        <ToggleSwitch
                                          active={sub.active}
                                          onChange={() => handleToggleSub(sub)}
                                          disabled={toggleSubLoading === sub.id}
                                        />
                                      </td>
                                      <td style={{ padding: '6px 8px' }}>
                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                          <button onClick={() => startEditSub(sub)}
                                            style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer', padding: '3px 8px' }}>
                                            Editar
                                          </button>
                                          <button onClick={() => handleDeleteSubClick(sub)}
                                            style={{ ...btnStyle, backgroundColor: 'var(--vsm-error-bg)', color: 'var(--vsm-error)', border: '1px solid var(--vsm-error-border)', cursor: 'pointer', padding: '3px 8px' }}>
                                            Eliminar
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Add subcategory form */}
                    <div style={{ borderTop: '1px dashed var(--vsm-gray)', paddingTop: '0.6rem' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--vsm-gray-mid)', marginBottom: '0.4rem' }}>Nueva subcategoría</p>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <input
                          value={newSubName[cat.id] ?? ''}
                          onChange={e => { setNewSubName(p => ({ ...p, [cat.id]: e.target.value })); setAddSubError(p => ({ ...p, [cat.id]: '' })) }}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddSub(cat) }}
                          placeholder="Nombre *"
                          style={{ ...inputStyle, maxWidth: 180, fontSize: '12px', padding: '5px 8px' }}
                          onFocus={onFocusBrand}
                          onBlur={onBlurGray}
                        />
                        <input
                          value={newSubDesc[cat.id] ?? ''}
                          onChange={e => setNewSubDesc(p => ({ ...p, [cat.id]: e.target.value }))}
                          placeholder="Descripción (opcional)"
                          style={{ ...inputStyle, maxWidth: 220, fontSize: '12px', padding: '5px 8px' }}
                          onFocus={onFocusBrand}
                          onBlur={onBlurGray}
                        />
                        <button
                          onClick={() => handleAddSub(cat)}
                          disabled={addSubLoading[cat.id]}
                          style={{
                            ...btnStyle,
                            backgroundColor: 'var(--vsm-brand)', color: '#fff',
                            padding: '5px 14px', fontSize: '12px',
                            opacity: addSubLoading[cat.id] ? 0.75 : 1,
                            cursor: addSubLoading[cat.id] ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {addSubLoading[cat.id] ? '...' : 'Agregar'}
                        </button>
                      </div>
                      {addSubError[cat.id] && (
                        <p style={{ color: 'var(--vsm-error)', fontSize: '11px', marginTop: '0.3rem' }}>{addSubError[cat.id]}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modals ── */}

      {/* Delete category — blocked */}
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

      {/* Delete category — confirm */}
      <ConfirmDialog
        isOpen={!!deleteCatTarget}
        onClose={() => setDeleteCatTarget(null)}
        onConfirm={handleDeleteCat}
        title="Eliminar categoría"
        message={`¿Marcar "${deleteCatTarget?.name}" como eliminada? Esta acción ocultará la categoría del catálogo.`}
        loading={deleteCatLoading}
      />

      {/* Toggle category — cascade warning */}
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
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginBottom: '1rem' }}>
              ¿Continuar?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setToggleWarning(null)}
                style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer', padding: '7px 18px' }}>
                Cancelar
              </button>
              <button onClick={confirmToggleCat}
                style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', cursor: 'pointer', padding: '7px 18px' }}>
                Desactivar
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete subcategory — blocked */}
      <AdminModal isOpen={!!blockSubInfo} onClose={() => setBlockSubInfo(null)} maxWidth="400px">
        {blockSubInfo && (
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--vsm-black)' }}>
              No se puede eliminar "{blockSubInfo.sub.name}"
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '0.5rem' }}>
              Esta subcategoría tiene {blockSubInfo.prodCount} producto{blockSubInfo.prodCount > 1 ? 's' : ''} activo{blockSubInfo.prodCount > 1 ? 's' : ''}.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>
              Desactiva o reasigna los productos antes de eliminar la subcategoría.
            </p>
            <div style={{ textAlign: 'right', marginTop: '1.25rem' }}>
              <button onClick={() => setBlockSubInfo(null)}
                style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer', padding: '7px 18px' }}>
                Entendido
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete subcategory — confirm */}
      <ConfirmDialog
        isOpen={!!deleteSubTarget}
        onClose={() => setDeleteSubTarget(null)}
        onConfirm={handleDeleteSub}
        title="Eliminar subcategoría"
        message={`¿Marcar "${deleteSubTarget?.name}" como eliminada? Esta acción ocultará la subcategoría del catálogo.`}
        loading={deleteSubLoading}
      />
    </div>
  )
}

export default CategoryList
