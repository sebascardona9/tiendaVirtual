import AdminModal from '../../shared/AdminModal'
import type { Product } from '../../../../../types/admin'

interface Props {
  isOpen:       boolean
  targetNombre: string
  onClose:      () => void
  onConfirm:    () => Promise<void>
  deleteLoading: boolean
  /** null = todavía verificando dependencias */
  blockInfo: { activeProducts: Product[] } | null
}

const AtributoDeleteModal = ({ isOpen, targetNombre, onClose, onConfirm, deleteLoading, blockInfo }: Props) => {
  const btnBase: React.CSSProperties = {
    padding: '9px 20px',
    borderRadius: 'var(--vsm-radius-sm)',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    border: 'none',
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} maxWidth="420px">

      {blockInfo === null ? (
        /* Verificando */
        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', padding: '0.5rem 0' }}>
          Verificando dependencias...
        </p>

      ) : blockInfo.activeProducts.length > 0 ? (
        /* Bloqueado */
        <>
          <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
            No se puede eliminar
          </h3>
          <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            <strong>"{targetNombre}"</strong> está asignado a{' '}
            {blockInfo.activeProducts.length} producto(s) activo(s).
            Desasígnalo primero desde cada producto.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ ...btnBase, backgroundColor: 'var(--vsm-gray)', color: 'var(--vsm-black)' }}>
              Cerrar
            </button>
          </div>
        </>

      ) : (
        /* Confirmar eliminación */
        <>
          <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
            Eliminar "{targetNombre}"
          </h3>
          <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Esta acción desactivará el registro. Los productos existentes conservarán el nombre guardado.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={onClose} disabled={deleteLoading}
              style={{ ...btnBase, border: '1px solid var(--vsm-gray)', backgroundColor: 'var(--vsm-white)', color: 'var(--vsm-gray-mid)', cursor: deleteLoading ? 'not-allowed' : 'pointer' }}>
              Cancelar
            </button>
            <button onClick={onConfirm} disabled={deleteLoading}
              style={{ ...btnBase, backgroundColor: 'var(--vsm-error)', color: '#fff', opacity: deleteLoading ? 0.75 : 1, cursor: deleteLoading ? 'not-allowed' : 'pointer' }}>
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </>
      )}

    </AdminModal>
  )
}

export default AtributoDeleteModal
