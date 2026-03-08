import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../../../firebase/firebase.config'
import type { Category } from '../../../../../types/admin'
import { inputStyle, btnStyle } from './categoryStyles'
import { onFocusBrand, onBlurGray } from '../../../../../styles/formStyles'

interface Props {
  categories: Category[]
}

const AddCategoryForm = ({ categories }: Props) => {
  const [name, setName]       = useState('')
  const [desc, setDesc]       = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('El nombre no puede estar vacío.'); return }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ya existe una categoría con ese nombre.'); return
    }
    setLoading(true)
    setError(null)
    try {
      await addDoc(collection(db, 'categories'), {
        name: trimmed,
        description: desc.trim(),
        active: true,
        createdAt: serverTimestamp(),
      })
      setName('')
      setDesc('')
    } catch {
      setError('Error al agregar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--vsm-bg)', borderRadius: '6px',
      padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--vsm-gray)',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--vsm-gray-mid)', marginBottom: '0.6rem' }}>
        Nueva categoría
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(null) }}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          placeholder="Nombre *"
          style={{ ...inputStyle, minWidth: 160 }}
          onFocus={onFocusBrand} onBlur={onBlurGray}
        />
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Descripción (opcional)"
          style={{ ...inputStyle, minWidth: 200 }}
          onFocus={onFocusBrand} onBlur={onBlurGray}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            ...btnStyle,
            backgroundColor: 'var(--vsm-brand)', color: '#fff',
            padding: '7px 16px', opacity: loading ? 0.75 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Agregando...' : 'Agregar'}
        </button>
      </div>
      {error && <p style={{ color: 'var(--vsm-error)', fontSize: '12px', marginTop: '0.4rem' }}>{error}</p>}
    </div>
  )
}

export default AddCategoryForm
