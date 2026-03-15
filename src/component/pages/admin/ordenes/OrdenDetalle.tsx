import { useState } from 'react'
import type { Orden, EstadoOrden } from '../../../../types/orden.types'
import { actualizarEstadoOrden } from '../../../../services/ordenes.service'
import { formatCOP } from '../../../../utils/formatters'
import OrdenEstadoBadge from './OrdenEstadoBadge'

interface Props {
  orden:    Orden
  onVolver: () => void
}

const ESTADOS: EstadoOrden[] = ['pendiente', 'enviado', 'entregado', 'cancelado']

const sec: React.CSSProperties = { marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--vsm-bg)', borderRadius: '10px', border: '1px solid var(--vsm-gray)' }
const secTitle: React.CSSProperties = { fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--vsm-gray-mid)', marginBottom: '0.75rem' }
const kv: React.CSSProperties = { display: 'flex', gap: '0.5rem', fontSize: '13px', marginBottom: '4px' }

const OrdenDetalle = ({ orden, onVolver }: Props) => {
  const [estado,   setEstado]   = useState<EstadoOrden>(orden.estado)
  const [saving,   setSaving]   = useState(false)
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = async () => {
    setSaving(true)
    try {
      await actualizarEstadoOrden(orden.id, estado)
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const envio = orden.envio
  const dir   = [envio?.direccion, envio?.barrio, envio?.municipioNombre, envio?.departamentoNombre].filter(Boolean).join(', ')

  return (
    <div>
      <button onClick={onVolver} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', marginBottom: '1.25rem', padding: 0 }}>
        ← Volver a órdenes
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--vsm-black)', margin: 0 }}>{orden.numeroOrden}</h2>
        <OrdenEstadoBadge estado={orden.estado} />
      </div>

      {/* Comprador */}
      <div style={sec}>
        <p style={secTitle}>Comprador</p>
        <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Nombre:</span><strong>{orden.comprador?.nombre}</strong></div>
        <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Email:</span><span>{orden.comprador?.email}</span></div>
        <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Teléfono:</span><span>{orden.comprador?.telefono}</span></div>
      </div>

      {/* Envío */}
      <div style={sec}>
        <p style={secTitle}>Envío</p>
        {envio?.esParaTercero && (
          <div style={{ backgroundColor: '#FEF9C3', border: '1px solid #FCD34D', borderRadius: '6px', padding: '6px 12px', marginBottom: '0.75rem', fontSize: '12px', fontWeight: 700, color: '#854D0E' }}>
            🎁 Pedido para tercero
          </div>
        )}
        <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Recibe:</span><strong>{envio?.nombreRecibe}</strong></div>
        <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Tel. recibe:</span><span>{envio?.telefonoRecibe}</span></div>
        <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Dirección:</span><span>{dir}</span></div>
        {envio?.indicaciones && (
          <div style={kv}><span style={{ color: 'var(--vsm-gray-mid)' }}>Indicaciones:</span><span>{envio.indicaciones}</span></div>
        )}
      </div>

      {/* Productos */}
      <div style={sec}>
        <p style={secTitle}>Productos</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
          {orden.items?.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '0.6rem', alignItems: 'center', fontSize: '13px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--vsm-gray)', flexShrink: 0 }}>
                {item.imagen ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🕯️</span>}
              </div>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{item.nombre}</p>
                <p style={{ color: 'var(--vsm-gray-mid)', margin: 0, fontSize: '11px' }}>
                  {[item.aroma && `Aroma: ${item.aroma}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ')}
                  {' '}× {item.cantidad}
                </p>
              </div>
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCOP(item.precio * item.cantidad)}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--vsm-gray)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '15px' }}>
          <span>Total</span><span style={{ color: 'var(--vsm-brand)' }}>{formatCOP(orden.total)}</span>
        </div>
      </div>

      {/* Estado */}
      <div style={sec}>
        <p style={secTitle}>Estado del pedido</p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={estado} onChange={e => setEstado(e.target.value as EstadoOrden)}
            style={{ padding: '0.6rem 1rem', borderRadius: '7px', border: '1.5px solid var(--vsm-gray)', fontSize: '13px', fontFamily: 'inherit', color: 'var(--vsm-black)', cursor: 'pointer', outline: 'none' }}>
            {ESTADOS.map(e => <option key={e} value={e} style={{ textTransform: 'capitalize' }}>{e}</option>)}
          </select>
          <button onClick={handleGuardar} disabled={saving}
            style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Guardando...' : 'Guardar cambio'}
          </button>
          {guardado && <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>✓ Guardado</span>}
        </div>
      </div>
    </div>
  )
}

export default OrdenDetalle
