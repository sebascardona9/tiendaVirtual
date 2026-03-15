import type { CSSProperties } from 'react'
import type { CheckoutState } from '../../types/cart.types'
import { useColombia } from '../../hooks/useColombia'
import CheckoutEnvioTercero from './CheckoutEnvioTercero'

const label: CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--vsm-black)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }
const input: CSSProperties = { width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1.5px solid var(--vsm-gray)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--vsm-black)', backgroundColor: 'var(--vsm-white)', outline: 'none', boxSizing: 'border-box' }
const err: CSSProperties   = { fontSize: '12px', color: '#DC2626', marginTop: '3px' }

interface Props {
  form:   CheckoutState
  errors: Record<string, string>
  onChange:              (field: keyof CheckoutState, value: string | boolean) => void
  onDepartamentoChange:  (codigo: string, nombre: string) => void
  onMunicipioChange:     (codigo: string, nombre: string) => void
  onTerceroDeptChange:   (codigo: string, nombre: string) => void
  onTerceroMuniChange:   (codigo: string, nombre: string) => void
}

const CheckoutDatosEnvio = ({ form, errors, onChange, onDepartamentoChange, onMunicipioChange, onTerceroDeptChange, onTerceroMuniChange }: Props) => {
  const { getDepartamentos, getMunicipios } = useColombia()
  const municipios = getMunicipios(form.departamentoCodigo)

  return (
    <div style={{ backgroundColor: 'var(--vsm-white)', borderRadius: '12px', border: '1px solid var(--vsm-gray)', padding: '1.5rem' }}>
      <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1rem' }}>
        Datos de envío
      </h3>

      {/* Banner contra entrega */}
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
        📦 Envío contra entrega — solo pagas el valor del producto al recibirlo.
      </div>

      {/* Checkbox tercero */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '1.25rem', fontSize: '14px', fontWeight: 600, color: 'var(--vsm-black)' }}>
        <input
          type="checkbox"
          checked={form.esParaTercero}
          onChange={e => onChange('esParaTercero', e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--vsm-brand)' }}
        />
        ¿El pedido es para otra persona?
      </label>

      {/* Dirección directa — solo si NO es tercero */}
      {!form.esParaTercero && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={label}>Departamento *</label>
              <select style={{ ...input, borderColor: errors.departamento ? '#DC2626' : 'var(--vsm-gray)' }}
                value={form.departamentoCodigo}
                onChange={e => { const d = getDepartamentos().find(d => d.codigo === e.target.value); if (d) onDepartamentoChange(d.codigo, d.nombre) }}>
                <option value="">Selecciona un departamento</option>
                {getDepartamentos().map(d => <option key={d.codigo} value={d.codigo}>{d.nombre}</option>)}
              </select>
              {errors.departamento && <p style={err}>{errors.departamento}</p>}
            </div>
            <div>
              <label style={label}>Municipio *</label>
              <select style={{ ...input, borderColor: errors.municipio ? '#DC2626' : 'var(--vsm-gray)' }}
                value={form.municipioCodigo} disabled={!form.departamentoCodigo}
                onChange={e => { const m = municipios.find(m => m.codigo === e.target.value); if (m) onMunicipioChange(m.codigo, m.nombre) }}>
                <option value="">{form.departamentoCodigo ? 'Selecciona un municipio' : 'Selecciona primero un departamento'}</option>
                {municipios.map(m => <option key={m.codigo} value={m.codigo}>{m.nombre}</option>)}
              </select>
              {errors.municipio && <p style={err}>{errors.municipio}</p>}
            </div>
          </div>

          <div>
            <label style={label}>Dirección exacta *</label>
            <input style={{ ...input, borderColor: errors.direccion ? '#DC2626' : 'var(--vsm-gray)' }}
              value={form.direccion} onChange={e => onChange('direccion', e.target.value)}
              placeholder="Calle 23 #45-67, Apto 301"
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = errors.direccion ? '#DC2626' : 'var(--vsm-gray)' }} />
            {errors.direccion && <p style={err}>{errors.direccion}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={label}>Barrio <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
              <input style={input} value={form.barrio} onChange={e => onChange('barrio', e.target.value)} placeholder="Nombre del barrio"
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'var(--vsm-gray)' }} />
            </div>
            <div>
              <label style={label}>Indicaciones <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
              <input style={input} value={form.indicaciones} onChange={e => onChange('indicaciones', e.target.value)}
                placeholder="Casa azul, timbre no funciona..."
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--vsm-brand)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'var(--vsm-gray)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Sección tercero con animación */}
      {form.esParaTercero && (
        <CheckoutEnvioTercero
          terceroNombre={form.terceroNombre}
          terceroTelefono={form.terceroTelefono}
          terceroDepartamentoCodigo={form.terceroDepartamentoCodigo}
          terceroMunicipioCodigo={form.terceroMunicipioCodigo}
          terceroDireccion={form.terceroDireccion}
          terceroBarrio={form.terceroBarrio}
          terceroIndicaciones={form.terceroIndicaciones}
          errors={errors}
          onChange={onChange}
          onDepartamentoChange={onTerceroDeptChange}
          onMunicipioChange={onTerceroMuniChange}
        />
      )}
    </div>
  )
}

export default CheckoutDatosEnvio
