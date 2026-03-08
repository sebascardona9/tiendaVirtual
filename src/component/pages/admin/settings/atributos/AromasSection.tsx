import { useState } from 'react'
import { useAromas } from '../../../../../hooks/useAromas'
import {
  checkAromaDependencies,
  deleteAroma,
  toggleAromaActive,
} from '../../../../../services/aromas.service'
import type { Aroma, Product } from '../../../../../types/admin'
import AromasList         from './AromasList'
import AromaForm          from './AromaForm'
import AtributoDeleteModal from './AtributoDeleteModal'

const AromasSection = () => {
  const { data: aromas, loading } = useAromas()

  const [showForm,      setShowForm]    = useState(false)
  const [editAroma,     setEditAroma]   = useState<Aroma | undefined>()
  const [deleteTarget,  setDeleteTarget] = useState<Aroma | null>(null)
  const [blockInfo,     setBlockInfo]   = useState<{ activeProducts: Product[] } | null>(null)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleNewClick = () => { setEditAroma(undefined); setShowForm(true) }

  const handleEditClick = (aroma: Aroma) => { setEditAroma(aroma); setShowForm(true) }

  const handleFormClose = () => setShowForm(false)

  const handleDeleteClick = async (aroma: Aroma) => {
    setDeleteTarget(aroma)
    setBlockInfo(null)
    try {
      const deps = await checkAromaDependencies(aroma.id)
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
      await deleteAroma(deleteTarget.id)
      handleDeleteClose()
    } catch {
      // silencioso — onSnapshot actualizará la lista de todas formas
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggle = async (aroma: Aroma) => {
    setToggleLoading(aroma.id)
    try { await toggleAromaActive(aroma.id, aroma.activo) }
    finally { setToggleLoading(null) }
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--vsm-black)', margin: 0 }}>Aromas</h3>
        <button
          onClick={handleNewClick}
          style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700, border: 'none', borderRadius: 'var(--vsm-radius-sm)', backgroundColor: 'var(--vsm-brand)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + Nuevo aroma
        </button>
      </div>

      {loading ? (
        <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}>Cargando...</p>
      ) : (
        <AromasList
          aromas={aromas}
          toggleLoading={toggleLoading}
          onToggle={handleToggle}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <AromaForm
        isOpen={showForm}
        onClose={handleFormClose}
        aroma={editAroma}
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

export default AromasSection
