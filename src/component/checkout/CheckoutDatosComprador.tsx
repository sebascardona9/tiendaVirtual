import type { CSSProperties } from 'react'
import type { CheckoutState } from '../../types/cart.types'

const label: CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--vsm-black)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }
const input: CSSProperties = { width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1.5px solid var(--vsm-gray)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--vsm-black)', backgroundColor: 'var(--vsm-white)', outline: 'none', boxSizing: 'border-box' }
const err: CSSProperties   = { fontSize: '12px', color: '#DC2626', marginTop: '3px' }

interface Props {
  nombre:   string
  email:    string
  telefono: string
  errors:   Record<string, string>
  onChange: (field: keyof CheckoutState, value: string) => void
}

const CheckoutDatosComprador = ({ nombre, email, telefono, errors, onChange }: Props) => (
  <div style={{ backgroundColor: 'var(--vsm-white)', borderRadius: '12px', border: '1px solid var(--vsm-gray)', padding: '1.5rem', marginBottom: '1.25rem' }}>
    <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
      Tus datos
    </h3>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={label}>Nombre completo *</label>
        <input
          style={{ ...input, borderColor: errors.nombre ? '#DC2626' : 'var(--vsm-gray)' }}
          value={nombre}
          onChange={e => onChange('nombre', e.target.value)}
          placeholder="Tu nombre completo"
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
          onBlur={e  => { e.currentTarget.style.borderColor = errors.nombre ? '#DC2626' : 'var(--vsm-gray)' }}
        />
        {errors.nombre && <p style={err}>{errors.nombre}</p>}
      </div>

      <div>
        <label style={label}>Correo electrónico *</label>
        <input
          type="email"
          style={{ ...input, borderColor: errors.email ? '#DC2626' : 'var(--vsm-gray)' }}
          value={email}
          onChange={e => onChange('email', e.target.value)}
          placeholder="tu@correo.com"
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
          onBlur={e  => { e.currentTarget.style.borderColor = errors.email ? '#DC2626' : 'var(--vsm-gray)' }}
        />
        {errors.email && <p style={err}>{errors.email}</p>}
      </div>

      <div>
        <label style={label}>Teléfono *</label>
        <input
          type="tel"
          style={{ ...input, borderColor: errors.telefono ? '#DC2626' : 'var(--vsm-gray)' }}
          value={telefono}
          onChange={e => onChange('telefono', e.target.value)}
          placeholder="3001234567"
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
          onBlur={e  => { e.currentTarget.style.borderColor = errors.telefono ? '#DC2626' : 'var(--vsm-gray)' }}
        />
        {errors.telefono && <p style={err}>{errors.telefono}</p>}
      </div>
    </div>
  </div>
)

export default CheckoutDatosComprador
