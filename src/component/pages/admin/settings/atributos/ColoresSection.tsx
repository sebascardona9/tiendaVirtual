import { useState } from 'react'
import { useColores } from '../../../../../hooks/useColores'
import {
  checkColorDependencies,
  deleteColor,
  toggleColorActive,
} from '../../../../../services/colores.service'
import type { Color, Product } from '../../../../../types/admin'
import ColoresList        from './ColoresList'
import ColorForm          from './ColorForm'
import AtributoDeleteModal from './AtributoDeleteModal'

const ColoresSection = () => {
  const { data: colores, loading } = useColores()

  const [showForm,      setShowForm]     = useState(false)
  const [editColor,     setEditColor]    = useState<Color | undefined>()
  const [deleteTarget,  setDeleteTarget] = useState<Color | null>(null)
  const [blockInfo,     setBlockInfo]    = useState<{ activeProducts: Product[] } | null>(null)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleNewClick = () => { setEditColor(undefined); setShowForm(true) }

  const handleEditClick = (color: Color) => { setEditColor(color); setShowForm(true) }

  const handleFormClose = () => setShowForm(false)

  const handleDeleteClick = async (color: Color) => {
    setDeleteTarget(color)
    setBlockInfo(null)
    try {
      const deps = await checkColorDependencies(color.id)
      setBlockInfo(deps)
    } catch {
      setBlockInfo({ activeProducts: [] })
    }
  }

  const handleDeleteClose = () => { setDeleteTarget(null); setBlockInfo(null) }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteColor(deleteTarget.id)
      handleDeleteClose()
    } catch {
      // silencioso — onSnapshot actualizará la lista
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggle = async (color: Color) => {
    setToggleLoading(color.id)
    try { await toggleColorActive(color.id, color.activo) }
    finally { setToggleLoading(null) }
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--vsm-black)', margin: 0 }}>Colores</h3>
        <button
          onClick={handleNewClick}
          style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700, border: 'none', borderRadius: 'var(--vsm-radius-sm)', backgroundColor: 'var(--vsm-brand)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + Nuevo color
        </button>
      </div>

      {loading ? (
        <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}>Cargando...</p>
      ) : (
        <ColoresList
          colores={colores}
          toggleLoading={toggleLoading}
          onToggle={handleToggle}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <ColorForm
        isOpen={showForm}
        onClose={handleFormClose}
        color={editColor}
      />

      <AtributoDeleteModal
        isOpen={deleteTarget !== null}
        targetNombre={deleteTarget?.nombre ?? ''}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        blockInfo={blockInfo}
      />
    </section>
  )
}

export default ColoresSection
