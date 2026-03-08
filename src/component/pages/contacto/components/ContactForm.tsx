import React, { useState } from 'react'
import type { CSSProperties, FocusEvent } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../../firebase/firebase.config'
import '../ContactPage.css'

interface FormState { name: string; email: string; subject: string; message: string }

const SUBJECTS = ['Consulta sobre producto', 'Pedido personalizado', 'Envíos y entregas', 'Otro']

const labelStyle: CSSProperties = {
  display:       'block',
  fontSize:      '12px',
  fontWeight:    700,
  color:         'var(--vsm-black)',
  marginBottom:  '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const inputBase: CSSProperties = {
  width:           '100%',
  padding:         '0.75rem 1rem',
  borderRadius:    '8px',
  border:          '1.5px solid var(--vsm-gray)',
  fontSize:        '14px',
  fontFamily:      'inherit',
  color:           'var(--vsm-black)',
  backgroundColor: 'var(--vsm-white)',
  outline:         'none',
  transition:      'border-color 0.2s ease',
  boxSizing:       'border-box',
}

type FieldEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
const focusBrand = (e: FocusEvent<FieldEl>) => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }
const blurGray   = (e: FocusEvent<FieldEl>) => { e.currentTarget.style.borderColor = 'var(--vsm-gray)'  }

const ContactForm = () => {
  const [form, setForm]     = useState<FormState>({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const setField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim())  e.name  = 'El nombre es requerido'
    if (!form.email.trim()) e.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un email válido'
    if (form.message.trim().length < 10) e.message = 'El mensaje debe tener al menos 10 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError(null)
    try {
      await addDoc(collection(db, 'messages'), {
        name:      form.name.trim(),
        email:     form.email.trim(),
        subject:   form.subject,
        message:   form.message.trim(),
        createdAt: serverTimestamp(),
        read:      false,
      })
      setSuccess(true)
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' })
    } catch {
      setError('Hubo un problema al enviar el mensaje. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="contact-success">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--vsm-black)', marginBottom: '0.5rem' }}>
          ¡Mensaje enviado!
        </h4>
        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto' }}>
          Gracias por contactarnos. Te responderemos a la brevedad posible.
        </p>
        <button
          onClick={() => setSuccess(false)}
          style={{
            marginTop: '1.5rem', backgroundColor: 'var(--vsm-brand)', color: '#fff',
            border: 'none', borderRadius: '8px', padding: '10px 24px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

      <div>
        <label style={labelStyle}>Nombre completo *</label>
        <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
          placeholder="Tu nombre"
          style={{ ...inputBase, borderColor: errors.name ? '#DC2626' : 'var(--vsm-gray)' }}
          onFocus={focusBrand} onBlur={blurGray} />
        {errors.name && <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.name}</p>}
      </div>

      <div>
        <label style={labelStyle}>Correo electrónico *</label>
        <input type="email" value={form.email} onChange={e => setField('email', e.target.value)}
          placeholder="tu@email.com"
          style={{ ...inputBase, borderColor: errors.email ? '#DC2626' : 'var(--vsm-gray)' }}
          onFocus={focusBrand} onBlur={blurGray} />
        {errors.email && <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.email}</p>}
      </div>

      <div>
        <label style={labelStyle}>Asunto</label>
        <select value={form.subject} onChange={e => setField('subject', e.target.value)}
          style={inputBase} onFocus={focusBrand} onBlur={blurGray}>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Mensaje *</label>
        <textarea value={form.message} onChange={e => setField('message', e.target.value)}
          placeholder="Cuéntanos en qué podemos ayudarte..."
          rows={5}
          style={{ ...inputBase, resize: 'vertical', borderColor: errors.message ? '#DC2626' : 'var(--vsm-gray)' }}
          onFocus={focusBrand} onBlur={blurGray} />
        {errors.message && <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.message}</p>}
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: 'var(--vsm-brand)', color: '#fff',
          border: 'none', borderRadius: '8px', padding: '14px',
          fontSize: '14px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.75 : 1, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', transition: 'opacity 0.2s ease',
        }}
      >
        {loading ? <><span className="contact-spinner" />Enviando...</> : 'Enviar mensaje'}
      </button>
    </form>
  )
}

export default ContactForm
