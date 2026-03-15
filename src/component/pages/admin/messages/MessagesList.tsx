import type { Message } from '../../../../types/admin'
import type { Timestamp } from 'firebase/firestore'

interface Props {
  messages: Message[]
  onSelect: (message: Message) => void
  onDelete: (message: Message) => void
}

const formatDate = (ts: Timestamp | undefined) => {
  if (!ts) return '—'
  return ts.toDate().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const MessagesList = ({ messages, onSelect, onDelete }: Props) => {
  if (messages.length === 0) {
    return (
      <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>
        No hay mensajes recibidos.
      </p>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--vsm-gray)' }}>
            {['', 'Nombre', 'Asunto', 'Fecha', ''].map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  color: 'var(--vsm-gray-mid)',
                  fontWeight: 700,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {messages.map(msg => (
            <tr
              key={msg.id}
              onClick={() => onSelect(msg)}
              style={{
                borderBottom: '1px solid var(--vsm-gray)',
                cursor: 'pointer',
                backgroundColor: msg.read ? 'transparent' : 'var(--vsm-bg-warm)',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--vsm-bg)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = msg.read ? 'transparent' : 'var(--vsm-bg-warm)')}
            >
              {/* Indicador no leído */}
              <td style={{ padding: '10px 12px', width: '8px' }}>
                {!msg.read && (
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--vsm-brand)',
                  }} />
                )}
              </td>

              <td style={{ padding: '10px 12px' }}>
                <p style={{ fontWeight: msg.read ? 500 : 700, color: 'var(--vsm-black)', marginBottom: '2px' }}>
                  {msg.name}
                </p>
                <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '12px' }}>{msg.email}</p>
              </td>

              <td style={{
                padding: '10px 12px',
                color: 'var(--vsm-black)',
                fontWeight: msg.read ? 400 : 600,
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {msg.subject}
              </td>

              <td style={{ padding: '10px 12px', color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>
                {formatDate(msg.createdAt)}
              </td>

              <td style={{ padding: '10px 12px' }}>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(msg) }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--vsm-gray-mid)',
                    fontSize: '14px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                  }}
                  title="Eliminar"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MessagesList
