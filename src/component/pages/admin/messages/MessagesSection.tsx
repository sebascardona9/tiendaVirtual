import { useMemo, useState } from 'react'
import useCollection from '../../../../hooks/useCollection'
import type { Message } from '../../../../types/admin'
import { markAsRead, deleteMessage } from '../../../../services/messages.service'
import MessagesList from './MessagesList'
import MessageDetail from './MessageDetail'
import ConfirmDialog from '../shared/ConfirmDialog'

const MessagesSection = () => {
  const { data, loading } = useCollection<Message>('messages')

  const [selected, setSelected]         = useState<Message | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const messages = useMemo(
    () => [...data].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? 0
      const bTime = b.createdAt?.toMillis?.() ?? 0
      return bTime - aTime
    }),
    [data],
  )

  const unreadCount = useMemo(() => messages.filter(m => !m.read).length, [messages])

  const handleSelect = async (msg: Message) => {
    setSelected(msg)
    if (!msg.read) {
      await markAsRead(msg.id).catch(console.error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteMessage(deleteTarget.id)
      if (selected?.id === deleteTarget.id) setSelected(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  const skeletonBox = (
    <div style={{
      backgroundColor: 'var(--vsm-gray)',
      borderRadius: 'var(--vsm-radius)',
      height: '44px',
      marginBottom: '4px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)' }}>
          Mensajes recibidos
        </h2>
        {unreadCount > 0 && (
          <span style={{
            backgroundColor: 'var(--vsm-brand)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '999px',
            padding: '2px 8px',
          }}>
            {unreadCount} sin leer
          </span>
        )}
      </div>

      {loading
        ? <>{skeletonBox}{skeletonBox}{skeletonBox}</>
        : (
          <MessagesList
            messages={messages}
            onSelect={handleSelect}
            onDelete={setDeleteTarget}
          />
        )
      }

      <MessageDetail message={selected} onClose={() => setSelected(null)} />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Eliminar mensaje"
        message={`¿Eliminar el mensaje de "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}

export default MessagesSection
