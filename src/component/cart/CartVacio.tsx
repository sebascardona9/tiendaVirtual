import { useNavigate } from 'react-router-dom'

const CartVacio = () => {
  const navigate = useNavigate()
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🕯️</div>
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
        Tu carrito está vacío
      </h2>
      <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', marginBottom: '2rem' }}>
        Todavía no has añadido ningún producto.
      </p>
      <button
        onClick={() => navigate('/catalogo')}
        style={{
          backgroundColor: 'var(--vsm-brand)', color: '#fff',
          border: 'none', borderRadius: '8px', padding: '12px 28px',
          fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Ver productos
      </button>
    </div>
  )
}

export default CartVacio
