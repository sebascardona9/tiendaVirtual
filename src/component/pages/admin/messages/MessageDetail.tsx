import type { Message } from '../../../../types/admin'
import type { Timestamp } from 'firebase/firestore'
import AdminModal from '../shared/AdminModal'

interface Props {
  message: Message | null
  onClose: () => void
}

const formatDate = (ts: Timestamp | undefined) => {
  if (!ts) return '—'
  return ts.toDate().toLocaleString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const field = (label: string, value: string) => (
  <div style={{ marginBottom: '1rem' }}>
    <p style={{
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--vsm-gray-mid)',
      marginBottom: '4px',
    }}>
      {label}
    </p>
    <p style={{ fontSize: '14px', color: 'var(--vsm-black)', lineHeight: 1.5 }}>{value}</p>
  </div>
)

const MessageDetail = ({ message, onClose }: Props) => {
  return (
    <AdminModal isOpen={!!message} onClose={onClose} maxWidth="600px">
      {message && (
        <>
          <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.5rem', paddingRight: '1.5rem' }}>
            {message.subject}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            {field('Nombre', message.name)}
            {field('Email', message.email)}
            {message.phone && field('Teléfono', message.phone)}
          </div>

          {field('Fecha', formatDate(message.createdAt))}

          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--vsm-gray-mid)',
              marginBottom: '8px',
            }}>
              Mensaje
            </p>
            <div style={{
              backgroundColor: 'var(--vsm-bg)',
              borderRadius: 'var(--vsm-radius-sm)',
              padding: '1rem 1.25rem',
              fontSize: '14px',
              color: 'var(--vsm-black)',
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
              border: '1px solid var(--vsm-gray)',
            }}>
              {message.message}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--vsm-brand)',
                color: '#fff',
                padding: '10px 22px',
                borderRadius: 'var(--vsm-radius-sm)',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Responder por email
            </a>
          </div>
        </>
      )}
    </AdminModal>
  )
}

export default MessageDetail
