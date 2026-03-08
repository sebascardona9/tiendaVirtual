import { useState } from 'react'
import { addDoc, updateDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../../../firebase/firebase.config'
import type { Category, Subcategory } from '../../../../../types/admin'
import {
  checkSubcategoryDependencies,
  deleteSubcategory,
  toggleSubcategoryActive,
  updateSubcategoryName,
} from '../../../../../services/subcategoryService'
import ConfirmDialog from '../../shared/ConfirmDialog'
import AdminModal    from '../../shared/AdminModal'
import ToggleSwitch  from '../../../../../ui/shared/ToggleSwitch'
import { inputStyle, btnStyle } from './categoryStyles'
import { onFocusBrand, onBlurGray } from '../../../../../styles/formStyles'

interface Props {
  cat:               Category
  subcategories:     Subcategory[]
  activeProdBySubMap: Map<string, number>
}

const SubcategoryPanel = ({ cat, subcategories, activeProdBySubMap }: Props) => {
  // ── Add sub ──────────────────────────────────────────────────────────────
  const [newName, setNewName]       = useState('')
  const [newDesc, setNewDesc]       = useState('')
  const [addError, setAddError]     = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) { setAddError('El nombre no puede estar vacío.'); return }
    if (subcategories.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setAddError('Ya existe una subcategoría con ese nombre.'); return
    }
    setAddLoading(true)
    setAddError(null)
    try {
      await addDoc(collection(db, 'subcategories'), {
        name,
        description: newDesc.trim(),
        categoryId:   cat.id,
        categoryName: cat.name,
        active:       true,
        createdAt:    serverTimestamp(),
      })
      setNewName('')
      setNewDesc('')
    } catch {
      setAddError('Error al agregar.')
    } finally {
      setAddLoading(false)
    }
  }

  // ── Edit sub ─────────────────────────────────────────────────────────────
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editName, setEditName]     = useState('')
  const [editDesc, setEditDesc]     = useState('')
  const [editError, setEditError]   = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const startEdit = (sub: Subcategory) => {
    setEditingId(sub.id)
    setEditName(sub.name)
    setEditDesc(sub.description ?? '')
    setEditError(null)
  }

  const handleEdit = async (sub: Subcategory) => {
    const trimmed = editName.trim()
    if (!trimmed) { setEditError('El nombre no puede estar vacío.'); return }
    if (subcategories.some(s => s.id !== sub.id && s.name.toLowerCase() === trimmed.toLowerCase())) {
      setEditError('Ya existe una subcategoría con ese nombre.'); return
    }
    setEditLoading(true)
    setEditError(null)
    try {
      if (trimmed !== sub.name) await updateSubcategoryName(sub.id, trimmed)
      if (editDesc.trim() !== (sub.description ?? '')) {
        await updateDoc(doc(db, 'subcategories', sub.id), { description: editDesc.trim() })
      }
      setEditingId(null)
    } catch {
      setEditError('Error al guardar.')
    } finally {
      setEditLoading(false)
    }
  }

  // ── Toggle sub ───────────────────────────────────────────────────────────
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  const handleToggle = async (sub: Subcategory) => {
    setToggleLoading(sub.id)
    try { await toggleSubcategoryActive(sub.id, sub.active) }
    catch { /* silent */ } finally { setToggleLoading(null) }
  }

  // ── Delete sub ───────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget]   = useState<Subcategory | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [blockInfo, setBlockInfo]         = useState<{ sub: Subcategory; prodCount: number } | null>(null)

  const handleDeleteClick = async (sub: Subcategory) => {
    const deps = await checkSubcategoryDependencies(sub.id)
    if (deps.activeProducts.length > 0) {
      setBlockInfo({ sub, prodCount: deps.activeProducts.length })
    } else {
      setDeleteTarget(sub)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try { await deleteSubcategory(deleteTarget.id); setDeleteTarget(null) }
    catch { /* silent */ } finally { setDeleteLoading(false) }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ borderTop: '1px solid var(--vsm-gray)', backgroundColor: 'var(--vsm-bg)', padding: '0.75rem 1rem' }}>

      {/* ── Subcategory table ── */}
      {subcategories.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginBottom: '0.75rem' }}>Sin subcategorías.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--vsm-gray)' }}>
                {['Nombre', 'Descripción', 'Prods activos', 'Activo', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '5px 8px', fontWeight: 700, color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subcategories.map(sub => {
                const isEditing = editingId === sub.id
                const subProds  = activeProdBySubMap.get(sub.id) ?? 0
                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--vsm-gray)', opacity: sub.active ? 1 : 0.6 }}>
                    {isEditing ? (
                      <td colSpan={5} style={{ padding: '6px 8px' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <input
                            value={editName}
                            onChange={e => { setEditName(e.target.value); setEditError(null) }}
                            onKeyDown={e => { if (e.key === 'Enter') handleEdit(sub) }}
                            placeholder="Nombre"
                            style={{ ...inputStyle, maxWidth: 180 }}
                            onFocus={onFocusBrand} onBlur={onBlurGray}
                            autoFocus
                          />
                          <input
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            placeholder="Descripción"
                            style={{ ...inputStyle, maxWidth: 200 }}
                            onFocus={onFocusBrand} onBlur={onBlurGray}
                          />
                          {editError && <span style={{ color: 'var(--vsm-error)', fontSize: '11px' }}>{editError}</span>}
                          <button onClick={() => handleEdit(sub)} disabled={editLoading}
                            style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', opacity: editLoading ? 0.75 : 1, cursor: editLoading ? 'not-allowed' : 'pointer' }}>
                            {editLoading ? '...' : 'Guardar'}
                          </button>
                          <button onClick={() => setEditingId(null)}
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
                          <ToggleSwitch active={sub.active} onChange={() => handleToggle(sub)} disabled={toggleLoading === sub.id} />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button onClick={() => startEdit(sub)}
                              style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer', padding: '3px 8px' }}>
                              Editar
                            </button>
                            <button onClick={() => handleDeleteClick(sub)}
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

      {/* ── Add subcategory form ── */}
      <div style={{ borderTop: '1px dashed var(--vsm-gray)', paddingTop: '0.6rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--vsm-gray-mid)', marginBottom: '0.4rem' }}>Nueva subcategoría</p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <input
            value={newName}
            onChange={e => { setNewName(e.target.value); setAddError(null) }}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            placeholder="Nombre *"
            style={{ ...inputStyle, maxWidth: 180, fontSize: '12px', padding: '5px 8px' }}
            onFocus={onFocusBrand} onBlur={onBlurGray}
          />
          <input
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Descripción (opcional)"
            style={{ ...inputStyle, maxWidth: 220, fontSize: '12px', padding: '5px 8px' }}
            onFocus={onFocusBrand} onBlur={onBlurGray}
          />
          <button
            onClick={handleAdd}
            disabled={addLoading}
            style={{
              ...btnStyle,
              backgroundColor: 'var(--vsm-brand)', color: '#fff',
              padding: '5px 14px', fontSize: '12px',
              opacity: addLoading ? 0.75 : 1,
              cursor: addLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {addLoading ? '...' : 'Agregar'}
          </button>
        </div>
        {addError && <p style={{ color: 'var(--vsm-error)', fontSize: '11px', marginTop: '0.3rem' }}>{addError}</p>}
      </div>

      {/* ── Modals ── */}
      <AdminModal isOpen={!!blockInfo} onClose={() => setBlockInfo(null)} maxWidth="400px">
        {blockInfo && (
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--vsm-black)' }}>
              No se puede eliminar "{blockInfo.sub.name}"
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '0.5rem' }}>
              Esta subcategoría tiene {blockInfo.prodCount} producto{blockInfo.prodCount > 1 ? 's' : ''} activo{blockInfo.prodCount > 1 ? 's' : ''}.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>
              Desactiva o reasigna los productos antes de eliminar la subcategoría.
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar subcategoría"
        message={`¿Marcar "${deleteTarget?.name}" como eliminada? Esta acción ocultará la subcategoría del catálogo.`}
        loading={deleteLoading}
      />
    </div>
  )
}

export default SubcategoryPanel
