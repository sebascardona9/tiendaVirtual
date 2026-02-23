import useCollection from '../../../../hooks/useCollection'
import type { Product, Category } from '../../../../types/admin'

const Dashboard = () => {
  const { data: products,   loading: loadingProd } = useCollection<Product>('products')
  const { data: categories, loading: loadingCat  } = useCollection<Category>('categories')
  const loading = loadingProd || loadingCat

  const sinStock = products.filter(p => p.stock === 0).length

  const skeletonBox = (
    <div style={{
      backgroundColor: 'var(--vsm-gray)',
      borderRadius: '8px',
      height: '110px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {skeletonBox}{skeletonBox}{skeletonBox}
      </div>
    )
  }

  const cards = [
    { label: 'Total Productos',   value: products.length,   color: 'var(--vsm-brand)' },
    { label: 'Total Categorías',  value: categories.length, color: 'var(--vsm-brand)' },
    { label: 'Sin Stock',         value: sinStock,          color: '#DC2626'           },
  ]

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Dashboard
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <div
            key={card.label}
            style={{
              backgroundColor: 'var(--vsm-white)',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              borderTop: `3px solid ${card.color}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
    </div>
  )
}

export default Dashboard
