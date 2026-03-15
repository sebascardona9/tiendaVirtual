import type { Orden } from '../../../../types/orden.types'
import OrdenEstadoBadge from './OrdenEstadoBadge'

interface Props {
  ordenes:    Orden[]
  onVerDetalle: (orden: Orden) => void
}

const formatFecha = (ts: Orden['creadoEn']): string => {
  if (!ts) return '—'
  const d = new Date(ts.seconds * 1000)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

const cell: React.CSSProperties = { padding: '0.75rem 1rem', fontSize: '13px', color: 'var(--vsm-black)', borderBottom: '1px solid var(--vsm-gray)', whiteSpace: 'nowrap' }
const head: React.CSSProperties = { ...cell, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--vsm-gray-mid)', backgroundColor: 'var(--vsm-bg)' }

const OrdenesList = ({ ordenes, onVerDetalle }: Props) => {
  if (ordenes.length === 0) {
    return <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', padding: '2rem 0' }}>No hay órdenes aún.</p>
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--vsm-gray)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Número', 'Fecha', 'Cliente', 'Total', 'Estado', 'Acción'].map(h => (
              <th key={h} style={head}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordenes.map(orden => (
            <tr key={orden.id} style={{ transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--vsm-bg)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <td style={{ ...cell, fontWeight: 700, color: 'var(--vsm-brand)' }}>{orden.numeroOrden}</td>
              <td style={cell}>{formatFecha(orden.creadoEn)}</td>
              <td style={cell}>
                <div style={{ fontWeight: 600 }}>{orden.comprador?.nombre}</div>
                <div style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>{orden.comprador?.telefono}</div>
              </td>
              <td style={{ ...cell, fontWeight: 700 }}>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(orden.total)}
              </td>
              <td style={cell}><OrdenEstadoBadge estado={orden.estado} /></td>
              <td style={cell}>
                <button
                  onClick={() => onVerDetalle(orden)}
                  style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdenesList
