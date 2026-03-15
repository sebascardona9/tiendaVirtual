import { useOrdenes } from '../../../../hooks/useOrdenes'
import OrdenesList  from './OrdenesList'
import OrdenDetalle from './OrdenDetalle'

const OrdenesPage = () => {
  const { ordenes, loading, selected, setSelected } = useOrdenes()

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: '56px', backgroundColor: 'var(--vsm-gray)', borderRadius: '8px', opacity: 0.4 }} />
        ))}
      </div>
    )
  }

  if (selected) {
    return <OrdenDetalle orden={selected} onVolver={() => setSelected(null)} />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', margin: 0 }}>
          Órdenes recibidas
        </h2>
        <span style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}>
          {ordenes.length} {ordenes.length === 1 ? 'orden' : 'órdenes'}
        </span>
      </div>

      <OrdenesList ordenes={ordenes} onVerDetalle={setSelected} />
    </div>
  )
}

export default OrdenesPage
