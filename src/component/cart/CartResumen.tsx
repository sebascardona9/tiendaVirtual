import { useNavigate } from 'react-router-dom'
import { formatCOP } from '../../utils/formatters'

interface Props {
  total: number
}

const row = { display: 'flex', justifyContent: 'space-between', fontSize: '14px' }

const CartResumen = ({ total }: Props) => {
  const navigate = useNavigate()

  return (
    <div style={{
      backgroundColor: 'var(--vsm-white)', borderRadius: '12px',
      border: '1px solid var(--vsm-gray)', padding: '1.5rem',
      position: 'sticky', top: '112px',
    }}>
      <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Resumen del pedido
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={row}>
          <span style={{ color: 'var(--vsm-gray-mid)' }}>Subtotal</span>
          <span style={{ fontWeight: 600 }}>{formatCOP(total)}</span>
        </div>
        <div style={row}>
          <span style={{ color: 'var(--vsm-gray-mid)' }}>Envío</span>
          <span style={{ fontWeight: 600, color: 'var(--vsm-brand)' }}>Contra entrega</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--vsm-gray)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ ...row, fontWeight: 800, fontSize: '16px', color: 'var(--vsm-black)' }}>
          <span>Total</span>
          <span>{formatCOP(total)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        style={{
          width: '100%', padding: '13px', backgroundColor: 'var(--vsm-brand)', color: '#fff',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit', marginBottom: '0.75rem',
        }}
      >
        Continuar con el pedido →
      </button>

      <button
        onClick={() => navigate('/catalogo')}
        style={{
          width: '100%', padding: '11px', backgroundColor: 'transparent', color: 'var(--vsm-gray-mid)',
          border: '1px solid var(--vsm-gray)', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Seguir comprando
      </button>
    </div>
  )
}

export default CartResumen
