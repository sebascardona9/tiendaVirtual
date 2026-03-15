import type { EstadoOrden } from '../../../../types/orden.types'

const config: Record<EstadoOrden, { label: string; bg: string; color: string }> = {
  pendiente:  { label: 'Pendiente',  bg: '#FEF9C3', color: '#854D0E' },
  enviado:    { label: 'Enviado',    bg: '#DBEAFE', color: '#1E40AF' },
  entregado:  { label: 'Entregado', bg: '#DCFCE7', color: '#166534' },
  cancelado:  { label: 'Cancelado', bg: '#FEE2E2', color: '#991B1B' },
}

const OrdenEstadoBadge = ({ estado }: { estado: EstadoOrden }) => {
  const c = config[estado] ?? config.pendiente
  return (
    <span style={{
      backgroundColor: c.bg, color: c.color,
      fontSize: '11px', fontWeight: 700,
      padding: '3px 10px', borderRadius: '999px',
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

export default OrdenEstadoBadge
