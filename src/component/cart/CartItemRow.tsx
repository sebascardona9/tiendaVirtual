import type { CartItem } from '../../types/cart.types'
import { formatCOP } from '../../utils/formatters'

interface Props {
  item: CartItem
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

const CartItemRow = ({ item, onQtyChange, onRemove }: Props) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '72px 1fr auto',
    gap: '1rem', alignItems: 'center',
    padding: '1rem', backgroundColor: 'var(--vsm-white)',
    borderRadius: '12px', border: '1px solid var(--vsm-gray)',
  }}>
    {/* Imagen */}
    <div style={{ width: 72, height: 72, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--vsm-gray)' }}>
      {item.imagen
        ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🕯️</div>
      }
    </div>

    {/* Info */}
    <div style={{ minWidth: 0 }}>
      <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--vsm-black)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.nombre}
      </p>
      {item.aroma && (
        <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginBottom: '1px' }}>
          Aroma: <strong>{item.aroma}</strong>
        </p>
      )}
      {item.color && (
        <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
          Color:
          {item.colorHex && <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.colorHex, border: '1px solid #ccc', display: 'inline-block' }} />}
          <strong>{item.color}</strong>
        </p>
      )}
      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--vsm-brand)', marginTop: '4px' }}>
        {formatCOP(item.precio)} × {item.cantidad} = <span style={{ color: 'var(--vsm-black)' }}>{formatCOP(item.precio * item.cantidad)}</span>
      </p>
    </div>

    {/* Controles */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--vsm-gray)', borderRadius: '6px', overflow: 'hidden' }}>
        <button onClick={() => onQtyChange(item.productoId, item.cantidad - 1)}
          style={{ width: 32, height: 32, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, color: 'var(--vsm-black)' }}>
          &minus;
        </button>
        <span style={{ width: 32, textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>{item.cantidad}</span>
        <button onClick={() => onQtyChange(item.productoId, item.cantidad + 1)}
          disabled={item.cantidad >= item.stock}
          style={{ width: 32, height: 32, border: 'none', backgroundColor: 'transparent', cursor: item.cantidad >= item.stock ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 700, color: item.cantidad >= item.stock ? 'var(--vsm-gray)' : 'var(--vsm-black)' }}>
          +
        </button>
      </div>
      <button onClick={() => onRemove(item.productoId)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: 600, padding: '2px 4px', fontFamily: 'inherit' }}>
        Eliminar
      </button>
    </div>
  </div>
)

export default CartItemRow
