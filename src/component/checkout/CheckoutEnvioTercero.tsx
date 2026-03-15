import type { CSSProperties } from 'react'
import type { CheckoutState } from '../../types/cart.types'
import { useColombia } from '../../hooks/useColombia'

const label: CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--vsm-black)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }
const input: CSSProperties = { width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1.5px solid var(--vsm-gray)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--vsm-black)', backgroundColor: 'var(--vsm-white)', outline: 'none', boxSizing: 'border-box' }
const err: CSSProperties   = { fontSize: '12px', color: '#DC2626', marginTop: '3px' }

interface Props {
  terceroNombre:    string
  terceroTelefono:  string
  terceroDepartamentoCodigo: string
  terceroMunicipioCodigo:    string
  terceroDireccion: string
  terceroBarrio:    string
  terceroIndicaciones: string
  errors: Record<string, string>
  onChange:              (field: keyof CheckoutState, value: string) => void
  onDepartamentoChange:  (codigo: string, nombre: string) => void
  onMunicipioChange:     (codigo: string, nombre: string) => void
}

const CheckoutEnvioTercero = ({ terceroNombre, terceroTelefono, terceroDepartamentoCodigo, terceroMunicipioCodigo, terceroDireccion, terceroBarrio, terceroIndicaciones, errors, onChange, onDepartamentoChange, onMunicipioChange }: Props) => {
  const { getDepartamentos, getMunicipios } = useColombia()
  const municipios = getMunicipios(terceroDepartamentoCodigo)

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--vsm-bg-warm)', borderRadius: '8px', border: '1px solid var(--vsm-gray)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--vsm-brand)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        🎁 Datos de quien recibe
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={label}>Nombre de quien recibe *</label>
          <input style={{ ...input, borderColor: errors.terceroNombre ? '#DC2626' : 'var(--vsm-gray)' }}
            value={terceroNombre} onChange={e => onChange('terceroNombre', e.target.value)} placeholder="Nombre completo"
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = errors.terceroNombre ? '#DC2626' : 'var(--vsm-gray)' }} />
          {errors.terceroNombre && <p style={err}>{errors.terceroNombre}</p>}
        </div>
        <div>
          <label style={label}>Teléfono de quien recibe *</label>
          <input type="tel" style={{ ...input, borderColor: errors.terceroTelefono ? '#DC2626' : 'var(--vsm-gray)' }}
            value={terceroTelefono} onChange={e => onChange('terceroTelefono', e.target.value)} placeholder="3001234567"
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = errors.terceroTelefono ? '#DC2626' : 'var(--vsm-gray)' }} />
          {errors.terceroTelefono && <p style={err}>{errors.terceroTelefono}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={label}>Departamento *</label>
          <select style={{ ...input, borderColor: errors.terceroDepartamento ? '#DC2626' : 'var(--vsm-gray)' }}
            value={terceroDepartamentoCodigo}
            onChange={e => { const d = getDepartamentos().find(d => d.codigo === e.target.value); if (d) onDepartamentoChange(d.codigo, d.nombre) }}>
            <option value="">Selecciona un departamento</option>
            {getDepartamentos().map(d => <option key={d.codigo} value={d.codigo}>{d.nombre}</option>)}
          </select>
          {errors.terceroDepartamento && <p style={err}>{errors.terceroDepartamento}</p>}
        </div>
        <div>
          <label style={label}>Municipio *</label>
          <select style={{ ...input, borderColor: errors.terceroMunicipio ? '#DC2626' : 'var(--vsm-gray)' }}
            value={terceroMunicipioCodigo} disabled={!terceroDepartamentoCodigo}
            onChange={e => { const m = municipios.find(m => m.codigo === e.target.value); if (m) onMunicipioChange(m.codigo, m.nombre) }}>
            <option value="">{terceroDepartamentoCodigo ? 'Selecciona un municipio' : 'Selecciona primero un departamento'}</option>
            {municipios.map(m => <option key={m.codigo} value={m.codigo}>{m.nombre}</option>)}
          </select>
          {errors.terceroMunicipio && <p style={err}>{errors.terceroMunicipio}</p>}
        </div>
      </div>

      <div>
        <label style={label}>Dirección exacta *</label>
        <input style={{ ...input, borderColor: errors.terceroDireccion ? '#DC2626' : 'var(--vsm-gray)' }}
          value={terceroDireccion} onChange={e => onChange('terceroDireccion', e.target.value)}
          placeholder="Calle 23 #45-67, Apto 301"
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
          onBlur={e  => { e.currentTarget.style.borderColor = errors.terceroDireccion ? '#DC2626' : 'var(--vsm-gray)' }} />
        {errors.terceroDireccion && <p style={err}>{errors.terceroDireccion}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={label}>Barrio <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
          <input style={input} value={terceroBarrio} onChange={e => onChange('terceroBarrio', e.target.value)} placeholder="Nombre del barrio"
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--vsm-gray)' }} />
        </div>
        <div>
          <label style={label}>Indicaciones <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
          <input style={input} value={terceroIndicaciones} onChange={e => onChange('terceroIndicaciones', e.target.value)}
            placeholder="Casa azul, timbre no funciona..."
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--vsm-gray)' }} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutEnvioTercero
