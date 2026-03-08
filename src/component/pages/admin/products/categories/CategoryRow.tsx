import { useState } from 'react'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../../../../firebase/firebase.config'
import type { Category, Subcategory } from '../../../../../types/admin'
import { updateCategoryName } from '../../../../../services/categoryService'
import ToggleSwitch      from '../../../../../ui/shared/ToggleSwitch'
import SubcategoryPanel  from './SubcategoryPanel'
import { inputStyle, btnStyle } from './categoryStyles'
import { onFocusBrand, onBlurGray } from '../../../../../styles/formStyles'

interface Props {
  cat:                Category
  categories:         Category[]
  isExpanded:         boolean
  activeSubs:         number
  subCount:           number
  activeProds:        number
  toggleLoading:      boolean
  subcategories:      Subcategory[]
  activeProdBySubMap: Map<string, number>
  onToggleExpand:     () => void
  onDeleteRequest:    (cat: Category) => void
  onToggleRequest:    (cat: Category) => void
}

const CategoryRow = ({
  cat, categories, isExpanded,
  activeSubs, subCount, activeProds,
  toggleLoading, subcategories, activeProdBySubMap,
  onToggleExpand, onDeleteRequest, onToggleRequest,
}: Props) => {
  const [isEditing, setIsEditing]   = useState(false)
  const [editName, setEditName]     = useState('')
  const [editDesc, setEditDesc]     = useState('')
  const [editError, setEditError]   = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const startEdit = () => {
    setIsEditing(true)
    setEditName(cat.name)
    setEditDesc(cat.description ?? '')
    setEditError(null)
  }

  const handleEdit = async () => {
    const trimmed = editName.trim()
    if (!trimmed) { setEditError('El nombre no puede estar vacío.'); return }
    if (categories.some(c => c.id !== cat.id && c.name.toLowerCase() === trimmed.toLowerCase())) {
      setEditError('Ya existe una categoría con ese nombre.'); return
    }
    setEditLoading(true)
    setEditError(null)
    try {
      if (trimmed !== cat.name) await updateCategoryName(cat.id, trimmed)
      if (editDesc.trim() !== (cat.description ?? '')) {
        await updateDoc(doc(db, 'categories', cat.id), { description: editDesc.trim() })
      }
      setIsEditing(false)
    } catch {
      setEditError('Error al guardar.')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div style={{ border: '1px solid var(--vsm-gray)', borderRadius: '6px', overflow: 'hidden', opacity: cat.active ? 1 : 0.65 }}>

      {/* ── Row header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '10px 12px', backgroundColor: 'var(--vsm-white)' }}>
        {isEditing ? (
          <>
            <input
              value={editName}
              onChange={e => { setEditName(e.target.value); setEditError(null) }}
              onKeyDown={e => { if (e.key === 'Enter') handleEdit() }}
              style={{ ...inputStyle, maxWidth: 200 }}
              onFocus={onFocusBrand} onBlur={onBlurGray}
              autoFocus
            />
            <input
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="Descripción"
              style={{ ...inputStyle, maxWidth: 220 }}
              onFocus={onFocusBrand} onBlur={onBlurGray}
            />
            {editError && <span style={{ color: 'var(--vsm-error)', fontSize: '11px' }}>{editError}</span>}
            <button onClick={handleEdit} disabled={editLoading}
              style={{ ...btnStyle, backgroundColor: 'var(--vsm-brand)', color: '#fff', opacity: editLoading ? 0.75 : 1, cursor: editLoading ? 'not-allowed' : 'pointer' }}>
              {editLoading ? '...' : 'Guardar'}
            </button>
            <button onClick={() => setIsEditing(false)}
              style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer' }}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onToggleExpand}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '12px', color: 'var(--vsm-gray-mid)' }}
              title={isExpanded ? 'Colapsar' : 'Expandir subcategorías'}>
              {isExpanded ? '▲' : '▼'}
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--vsm-black)' }}>{cat.name}</span>
              {cat.description && (
                <span style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', marginLeft: '8px' }}>{cat.description}</span>
              )}
            </div>

            <span style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>
              {activeSubs}/{subCount} subs · {activeProds} prods
            </span>

            <ToggleSwitch active={cat.active} onChange={() => onToggleRequest(cat)} disabled={toggleLoading} />

            <button onClick={startEdit}
              style={{ ...btnStyle, border: '1px solid var(--vsm-gray)', color: 'var(--vsm-gray-mid)', backgroundColor: 'transparent', cursor: 'pointer' }}>
              Editar
            </button>
            <button onClick={() => onDeleteRequest(cat)}
              style={{ ...btnStyle, backgroundColor: 'var(--vsm-error-bg)', color: 'var(--vsm-error)', border: '1px solid var(--vsm-error-border)', cursor: 'pointer' }}>
              Eliminar
            </button>
          </>
        )}
      </div>

      {/* ── Expanded panel ── */}
      {isExpanded && (
        <SubcategoryPanel
          cat={cat}
          subcategories={subcategories}
          activeProdBySubMap={activeProdBySubMap}
        />
      )}
    </div>
  )
}

export default CategoryRow
