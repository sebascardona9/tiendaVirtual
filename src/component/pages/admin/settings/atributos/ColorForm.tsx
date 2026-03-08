import React, { useState, useEffect } from 'react'
import AdminModal from '../../shared/AdminModal'
import { saveColor } from '../../../../../services/colores.service'
import type { Color, ColorFormData } from '../../../../../types/admin'
import { inputStyle, labelStyle, errorBox, errorText } from '../../../../../styles/formStyles'

interface Props {
  isOpen:  boolean
  onClose: () => void
  color?:  Color
}

const empty: ColorFormData = { nombre: '', codigoHex: '#C8732A', activo: true }

const ColorForm = ({ isOpen, onClose, color }: Props) => {
  const [form, setForm]       = useState<ColorFormData>(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setForm(color
      ? { nombre: color.nombre, codigoHex: color.codigoHex ?? '#C8732A', activo: color.activo }
      : empty,
    )
    setError(null)
  }, [isOpen, color])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setLoading(true)
    setError(null)
    try {
      await saveColor(form, color?.id)
      onClose()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} maxWidth="440px">
      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        {color ? 'Editar color' : 'Nuevo color'}
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div>
            <label style={labelStyle}>Nombre <span style={{ color: 'var(--vsm-error)' }}>*</span></label>
            <input
              value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              style={inputStyle}
              placeholder="Ej: Rojo Navidad"
            />
          </div>

          <div>
            <label style={labelStyle}>Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="color"
                value={form.codigoHex}
                onChange={e => setForm(p => ({ ...p, codigoHex: e.target.value }))}
                style={{ width: 44, height: 38, border: '1px solid var(--vsm-gray)', borderRadius: 'var(--vsm-radius-sm)', cursor: 'pointer', padding: 2 }}
              />
              <input
                value={form.codigoHex}
                onChange={e => setForm(p => ({ ...p, codigoHex: e.target.value }))}
                style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }}
                placeholder="#C8732A"
                maxLength={7}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              id="color-activo"
              type="checkbox"
              checked={form.activo}
              onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--vsm-brand)' }}
            />
            <label htmlFor="color-activo" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontWeight: 600 }}>
              Activo (disponible en el formulario de producto)
            </label>
          </div>

          {error && <div style={errorBox}><p style={errorText}>{error}</p></div>}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
            <button type="button" onClick={onClose} disabled={loading}
              style={{ padding: '9px 20px', borderRadius: 'var(--vsm-radius-sm)', border: '1px solid var(--vsm-gray)', backgroundColor: 'var(--vsm-white)', color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '9px 20px', borderRadius: 'var(--vsm-radius-sm)', border: 'none', backgroundColor: 'var(--vsm-brand)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

        </div>
      </form>
    </AdminModal>
  )
}

export default ColorForm
