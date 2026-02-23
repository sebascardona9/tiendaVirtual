import { useState } from 'react'
import {
  addDoc, updateDoc, deleteDoc,
  collection, doc, serverTimestamp, orderBy,
} from 'firebase/firestore'
import { db } from '../../../../firebase/firebase.config'
import type { Category } from '../../../../types/admin'
import ConfirmDialog from '../shared/ConfirmDialog'
import useCollection from '../../../../hooks/useCollection'

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid var(--vsm-gray)',
  borderRadius: '5px',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  flex: 1,
}

const CategoryList = () => {
  const { data: categories } = useCollection<Category>('categories', orderBy('createdAt', 'asc'))

  const [newName, setNewName]         = useState('')
  const [addError, setAddError]       = useState<string | null>(null)
  const [addLoading, setAddLoading]   = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [editName, setEditName]       = useState('')
  const [editError, setEditError]     = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleAdd = async () => {
    const trimmed = newName.trim()
    if (!trimmed) { setAddError('El nombre no puede estar vacío.'); return }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setAddError('Ya existe una categoría con ese nombre.'); return
    }
    setAddLoading(true)
    setAddError(null)
    try {
      await addDoc(collection(db, 'categories'), { name: trimmed, createdAt: serverTimestamp() })
      setNewName('')
    } catch {
      setAddError('Error al agregar. Intenta de nuevo.')
    } finally {
      setAddLoading(false)
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditError(null)
  }

  const handleEdit = async (cat: Category) => {
    const trimmed = editName.trim()
    if (!trimmed) { setEditError('El nombre no puede estar vacío.'); return }
    if (categories.some(c => c.id !== cat.id && c.name.toLowerCase() === trimmed.toLowerCase())) {
      setEditError('Ya existe una categoría con ese nombre.'); return
    }
    setEditLoading(true)
    setEditError(null)
    try {
      await updateDoc(doc(db, 'categories', cat.id), { name: trimmed })
      setEditingId(null)
    } catch {
      setEditError('Error al guardar. Intenta de nuevo.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteDoc(doc(db, 'categories', deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      // silent
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1rem' }}>
        Categorías
      </h3>

      {/* Add new */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          value={newName}
          onChange={e => { setNewName(e.target.value); setAddError(null) }}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          placeholder="Nueva categoría..."
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--vsm-brand)')}
          onBlur={e  => (e.currentTarget.style.borderColor = 'var(--vsm-gray)')}
        />
        <button
          onClick={handleAdd}
          disabled={addLoading}
          style={{
            backgroundColor: 'var(--vsm-brand)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: addLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            opacity: addLoading ? 0.75 : 1,
          }}
        >
          {addLoading ? 'Agregando...' : 'Agregar'}
        </button>
      </div>
      {addError && <p style={{ color: '#DC2626', fontSize: '12px', marginBottom: '0.75rem' }}>{addError}</p>}

      {/* List */}
      {categories.length === 0 ? (
        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>No hay categorías aún.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(cat => (
            <li
              key={cat.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                backgroundColor: 'var(--vsm-white)',
                border: '1px solid var(--vsm-gray)',
                borderRadius: '6px',
                padding: '8px 12px',
              }}
            >
              {editingId === cat.id ? (
                <>
                  <input
                    value={editName}
                    onChange={e => { setEditName(e.target.value); setEditError(null) }}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(cat) }}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--vsm-brand)')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'var(--vsm-gray)')}
                    autoFocus
                  />
                  {editError && <span style={{ color: '#DC2626', fontSize: '11px' }}>{editError}</span>}
                  <button
                    onClick={() => handleEdit(cat)}
                    disabled={editLoading}
                    style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', opacity: editLoading ? 0.75 : 1 }}
                  >
                    {editLoading ? '...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)' }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: '14px', color: 'var(--vsm-black)' }}>{cat.name}</span>
                  <button onClick={() => startEdit(cat)} style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)' }}>
                    Editar
                  </button>
                  <button onClick={() => setDeleteTarget(cat)} style={{ ...btnStyle, backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={`¿Eliminar "${deleteTarget?.name}"? Esto no eliminará los productos asociados.`}
        loading={deleteLoading}
      />
    </div>
  )
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

export default CategoryList
