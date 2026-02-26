import { useState, useEffect, useRef } from 'react'
import type { ReactNode, CSSProperties, FocusEvent } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../firebase/firebase.config'
import { useSettings } from '../../../hooks/useSettings'
import './ContactPage.css'

// ── FadeIn wrapper (IntersectionObserver) ────────────────────────────────────
const FadeIn = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ── Info card ─────────────────────────────────────────────────────────────────
interface InfoCardProps { icon: string; label: string; value: string; href?: string }

const InfoCard = ({ icon, label, value, href }: InfoCardProps) => {
  const [hovered, setHovered] = useState(false)

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        backgroundColor: 'var(--vsm-white)',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: hovered ? '0 8px 24px rgba(201,107,43,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      <span style={{
        fontSize: '1.4rem',
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        backgroundColor: 'rgba(201,107,43,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--vsm-gray-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--vsm-black)', lineHeight: 1.5, margin: 0 }}>
          {value || <span style={{ color: 'var(--vsm-gray-mid)', fontStyle: 'italic', fontWeight: 400 }}>No configurado</span>}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </a>
    )
  }
  return card
}

// ── WhatsApp button ───────────────────────────────────────────────────────────
const WhatsAppButton = ({ phone }: { phone: string }) => {
  const [hovered, setHovered] = useState(false)
  const clean = phone.replace(/\D/g, '')
  const href = clean ? `https://wa.me/${clean}` : undefined

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: hovered ? '#1ea952' : '#25D366',
        color: '#fff',
        padding: '0.9rem 1.75rem',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '14px',
        fontFamily: 'inherit',
        boxShadow: hovered ? '0 8px 24px rgba(37,211,102,0.45)' : '0 4px 14px rgba(37,211,102,0.3)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        pointerEvents: href ? 'auto' : 'none',
        opacity: href ? 1 : 0.5,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Escríbenos por WhatsApp
    </a>
  )
}

// ── Instagram link ────────────────────────────────────────────────────────────
const InstagramLink = ({ url }: { url: string }) => {
  const [hovered, setHovered] = useState(false)
  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: hovered ? '#C13584' : 'var(--vsm-gray-mid)',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '14px',
        transition: 'color 0.25s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
      Instagram
    </a>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────
interface FormState { name: string; email: string; subject: string; message: string }

const SUBJECTS = ['Consulta sobre producto', 'Pedido personalizado', 'Envíos y entregas', 'Otro']

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--vsm-black)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const inputBase: CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1.5px solid var(--vsm-gray)',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: 'var(--vsm-black)',
  backgroundColor: 'var(--vsm-white)',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
}

type FieldEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const focusBrand = (e: FocusEvent<FieldEl>) => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }
const blurGray   = (e: FocusEvent<FieldEl>) => { e.currentTarget.style.borderColor = 'var(--vsm-gray)' }

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
    if (!form.name.trim())    e.name    = 'El nombre es requerido'
    if (!form.email.trim())   e.email   = 'El email es requerido'
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
            marginTop: '1.5rem',
            backgroundColor: 'var(--vsm-brand)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

      {/* Nombre */}
      <div>
        <label style={labelStyle}>Nombre completo *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setField('name', e.target.value)}
          placeholder="Tu nombre"
          style={{ ...inputBase, borderColor: errors.name ? '#DC2626' : 'var(--vsm-gray)' }}
          onFocus={focusBrand} onBlur={blurGray}
        />
        {errors.name && <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>Correo electrónico *</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setField('email', e.target.value)}
          placeholder="tu@email.com"
          style={{ ...inputBase, borderColor: errors.email ? '#DC2626' : 'var(--vsm-gray)' }}
          onFocus={focusBrand} onBlur={blurGray}
        />
        {errors.email && <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.email}</p>}
      </div>

      {/* Asunto */}
      <div>
        <label style={labelStyle}>Asunto</label>
        <select
          value={form.subject}
          onChange={e => setField('subject', e.target.value)}
          style={inputBase}
          onFocus={focusBrand} onBlur={blurGray}
        >
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label style={labelStyle}>Mensaje *</label>
        <textarea
          value={form.message}
          onChange={e => setField('message', e.target.value)}
          placeholder="Cuéntanos en qué podemos ayudarte..."
          rows={5}
          style={{ ...inputBase, resize: 'vertical', borderColor: errors.message ? '#DC2626' : 'var(--vsm-gray)' }}
          onFocus={focusBrand} onBlur={blurGray}
        />
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
          backgroundColor: 'var(--vsm-brand)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '14px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.75 : 1,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'opacity 0.2s ease',
        }}
      >
        {loading ? <><span className="contact-spinner" />Enviando...</> : 'Enviar mensaje'}
      </button>
    </form>
  )
}

// ── Contact Page ──────────────────────────────────────────────────────────────
const ContactPage = () => {
  const { settings } = useSettings()

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: '#1A1208',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '9rem 2rem 6rem',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,115,42,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Eyebrow con líneas decorativas */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
            fontSize: '11px', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(232,146,74,0.9)', marginBottom: '1.5rem',
          }}>
            <span style={{ width: '48px', height: '1px', background: '#C8732A', opacity: 0.5, display: 'block' }} />
            Estamos aquí para ti
            <span style={{ width: '48px', height: '1px', background: '#C8732A', opacity: 0.5, display: 'block' }} />
          </div>

          <h1 style={{
            color: '#F5EFE4',
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            ¿<em style={{ fontStyle: 'italic', color: 'rgba(232,146,74,0.95)' }}>Hablamos</em>?
          </h1>

          <p style={{
            color: 'rgba(245,239,228,0.6)',
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.8,
            maxWidth: '420px',
            margin: '0 auto',
          }}>
            Estamos en Santa Marta, Colombia.<br />
            Escríbenos y te respondemos pronto.
          </p>
        </div>

        {/* Candle flame bottom */}
        <div style={{
          position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '2.5rem', lineHeight: 1,
          filter: 'drop-shadow(0 0 20px rgba(200,115,42,0.8))',
          opacity: 0.5,
        }}>
          🕯️
        </div>
      </section>

      {/* ── Main: dos columnas ── */}
      <section style={{ backgroundColor: 'var(--vsm-bg)', padding: '5rem 2rem' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}>

          {/* ── Columna izquierda: info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FadeIn delay={0}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--vsm-black)', marginBottom: '0.25rem' }}>
                Información de contacto
              </h2>
              <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Contáctanos por cualquiera de estos medios o visítanos en nuestra ubicación.
              </p>
            </FadeIn>

            <FadeIn delay={80}>
              <InfoCard icon="📍" label="Dirección" value={settings?.address ?? ''} />
            </FadeIn>

            <FadeIn delay={140}>
              <InfoCard
                icon="📧" label="Correo electrónico" value={settings?.email ?? ''}
                href={settings?.email ? `mailto:${settings.email}` : undefined}
              />
            </FadeIn>

            <FadeIn delay={200}>
              <InfoCard icon="📱" label="Teléfono / WhatsApp" value={settings?.phone ?? ''} />
            </FadeIn>

            <FadeIn delay={260}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', marginTop: '0.5rem' }}>
                <WhatsAppButton phone={settings?.phone ?? ''} />
                <InstagramLink url={settings?.social?.instagram ?? ''} />
              </div>
            </FadeIn>
          </div>

          {/* ── Columna derecha: formulario ── */}
          <FadeIn delay={150}>
            <div style={{
              backgroundColor: 'var(--vsm-white)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--vsm-black)', marginBottom: '1.5rem' }}>
                Envíanos un mensaje
              </h3>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Quote banner ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1A0800 0%, #2D1200 100%)',
        padding: '4.5rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          ✦ Velas Santa Marta
        </p>
        <blockquote style={{
          color: '#fff',
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          fontWeight: 700,
          lineHeight: 1.5,
          maxWidth: '600px',
          margin: '0 auto',
          fontStyle: 'italic',
        }}>
          "Cada vela cuenta una historia diferente"
        </blockquote>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '1rem' }}>
          Hecha a mano con amor desde el Caribe colombiano
        </p>
      </section>
    </div>
  )
}

export default ContactPage
