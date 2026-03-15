import type { CartItem } from '../../types/cart.types'
import { formatCOP } from '../../utils/formatters'

interface Props {
  items: CartItem[]
  total: number
}

const CheckoutResumenOrden = ({ items, total }: Props) => (
  <div style={{ backgroundColor: 'var(--vsm-white)', borderRadius: '12px', border: '1px solid var(--vsm-gray)', padding: '1.5rem' }}>
    <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
      Tu pedido
    </h3>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
      {items.map(item => (
        <div key={item.productoId} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--vsm-gray)' }}>
            {item.imagen
              ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🕯️</div>
            }
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--vsm-black)', margin: 0 }}>{item.nombre}</p>
            {item.aroma && <p style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', margin: 0 }}>Aroma: {item.aroma}</p>}
            {item.color && <p style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', margin: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
              Color:
              {item.colorHex && <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.colorHex, border: '1px solid #ccc', display: 'inline-block' }} />}
              {item.color}
            </p>}
            <p style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', margin: 0 }}>Cant: {item.cantidad}</p>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--vsm-black)', margin: 0, whiteSpace: 'nowrap' }}>
            {formatCOP(item.precio * item.cantidad)}
          </p>
        </div>
      ))}
    </div>

    <div style={{ borderTop: '1px solid var(--vsm-gray)', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
        <span>Total</span>
        <span>{formatCOP(total)}</span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', textAlign: 'center' }}>
        🔒 Envío se paga con la entrega — 100% seguro
      </p>
    </div>
  </div>
)

export default CheckoutResumenOrden
