import AdminModal from './AdminModal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmDialogProps) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} maxWidth="420px">
      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            padding: '9px 20px',
            borderRadius: 'var(--vsm-radius-sm)',
            border: '1px solid var(--vsm-gray)',
            backgroundColor: 'var(--vsm-white)',
            color: 'var(--vsm-gray-mid)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '9px 20px',
            borderRadius: 'var(--vsm-radius-sm)',
            border: 'none',
            backgroundColor: 'var(--vsm-error)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1,
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </AdminModal>
  )
}

export default ConfirmDialog
