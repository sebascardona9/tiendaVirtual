import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { where } from 'firebase/firestore'
import useCollection from '../../../../hooks/useCollection'
import ProductCarousel from '../../../../ui/carousels/ProductCarousel'
import type { Category, Product } from '../../../../types/admin'

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CategoryCardSkeleton = () => (
  <div style={{
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    backgroundColor: 'var(--vsm-white)',
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div style={{ aspectRatio: '4/3', backgroundColor: 'var(--vsm-gray)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ height: '18px', width: '55%', backgroundColor: 'var(--vsm-gray)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '13px', width: '90%', backgroundColor: 'var(--vsm-gray)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '13px', width: '70%', backgroundColor: 'var(--vsm-gray)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  </div>
)

// ── Category card ─────────────────────────────────────────────────────────────
interface CategoryCardProps {
  category: Category
  products: Product[]
}

const CategoryCard = ({ category, products }: CategoryCardProps) => (
  <div style={{
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    backgroundColor: 'var(--vsm-white)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }}>
    <ProductCarousel products={products} autoIntervalMs={5000} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--vsm-black)', margin: 0 }}>
        {category.name}
      </h3>
      {category.description && (
        <p style={{
          color: 'var(--vsm-gray-mid)',
          fontSize: '13px',
          lineHeight: 1.6,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {category.description}
        </p>
      )}
      <Link
        to={`/catalogo?categoria=${category.id}`}
        style={{
          color: 'var(--vsm-brand)',
          fontWeight: 700,
          fontSize: '13px',
          textDecoration: 'none',
          marginTop: 'auto',
          paddingTop: '0.25rem',
        }}
      >
        Ver productos →
      </Link>
    </div>
  </div>
)

// ── CategoryCards ─────────────────────────────────────────────────────────────
const CategoryCards = () => {
  const { data: categories, loading: loadingCats } = useCollection<Category>('categories', where('active', '==', true))
  const { data: products,   loading: loadingProds } = useCollection<Product>('products',   where('active', '==', true))

  const loading = loadingCats || loadingProds

  // Group products by categoryId
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const p of products) {
      if (!p.categoryId) continue
      const list = map.get(p.categoryId) ?? []
      list.push(p)
      map.set(p.categoryId, list)
    }
    return map
  }, [products])

  // Only show categories that have at least one active product
  const visibleCategories = useMemo(
    () => categories.filter(c => (productsByCategory.get(c.id)?.length ?? 0) > 0),
    [categories, productsByCategory],
  )

  const colsClass = visibleCategories.length >= 3
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid grid-cols-1 md:grid-cols-2 gap-6'

  return (
    <section style={{ backgroundColor: 'var(--vsm-white)' }} className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '2rem' }}>
          Conoce nuestras Velas y otros productos
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
          </div>
        ) : visibleCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--vsm-gray-mid)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕯️</div>
            <p style={{ fontWeight: 600 }}>Próximamente nuevos productos</p>
          </div>
        ) : (
          <div className={colsClass}>
            {visibleCategories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                products={productsByCategory.get(cat.id) ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryCards
