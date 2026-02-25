import useCollection from '../../../../hooks/useCollection'
import type { Product, Category } from '../../../../types/admin'
import StockCard from './StockCard'

const Dashboard = () => {
  const { data: products,   loading: loadingProd } = useCollection<Product>('products')
  const { data: categories, loading: loadingCat  } = useCollection<Category>('categories')
  const loading = loadingProd || loadingCat

  const skeletonBox = (
    <div style={{
      backgroundColor: 'var(--vsm-gray)',
      borderRadius: 'var(--vsm-radius)',
      height: '110px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )

  if (loading) {
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {skeletonBox}{skeletonBox}
        </div>
        {skeletonBox}
      </div>
    )
  }

  const statCards = [
    { label: 'Total Productos',  value: products.length,   color: 'var(--vsm-brand)' },
    { label: 'Total Categorías', value: categories.length, color: 'var(--vsm-brand)' },
  ]

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Dashboard
      </h2>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        {statCards.map(card => (
          <div
            key={card.label}
            style={{
              backgroundColor: 'var(--vsm-white)',
              borderRadius: 'var(--vsm-radius)',
              padding: '1.25rem 1.5rem',
              borderTop: `3px solid ${card.color}`,
              boxShadow: 'var(--vsm-shadow-sm)',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', fontWeight: 600, marginBottom: '0.5rem' }}>
              {card.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: card.color, lineHeight: 1 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tarjeta de stock desplegable */}
      <StockCard products={products} categories={categories} />
    </div>
  )
}

export default Dashboard
