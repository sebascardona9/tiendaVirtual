import { Link } from 'react-router-dom'

const NotFoundProduct = () => (
  <div style={{ maxWidth: '560px', margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
      Producto no encontrado
    </h2>
    <p style={{ color: 'var(--vsm-gray-mid)', marginBottom: '2rem', lineHeight: 1.6 }}>
      El producto que buscas no existe o fue eliminado.
    </p>
    <Link
      to="/catalogo"
      style={{ color: 'var(--vsm-brand)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
    >
      Volver al catalogo
    </Link>
  </div>
)

export default NotFoundProduct
