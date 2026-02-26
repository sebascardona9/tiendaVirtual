import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { where } from 'firebase/firestore'
import useCollection from '../../../../hooks/useCollection'
import type { Subcategory, Product } from '../../../../types/admin'

const SkeletonCard = () => (
  <div style={{
    backgroundColor: 'var(--vsm-white)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  }}>
    <div style={{ aspectRatio: '1', backgroundColor: 'var(--vsm-gray)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
      <div style={{ height: '13px', width: '70%', backgroundColor: 'var(--vsm-gray)', borderRadius: '3px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '11px', width: '90%', backgroundColor: 'var(--vsm-gray)', borderRadius: '3px', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  </div>
)

const CandleTypesSection = () => {
  const { data: subcategories, loading: loadingSubs } = useCollection<Subcategory>(
    'subcategories',
    where('active', '==', true),
  )
  const { data: products, loading: loadingProds } = useCollection<Product>(
    'products',
    where('active', '==', true),
  )

  const loading = loadingSubs || loadingProds

  // Primera imagen disponible por subcategoría
  const imageBySubcategory = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of products) {
      if (!p.subcategoryId) continue
      if (map.has(p.subcategoryId)) continue
      const img = p.images?.[0] ?? p.imageUrl ?? ''
      if (img) map.set(p.subcategoryId, img)
    }
    return map
  }, [products])

  if (!loading && subcategories.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--vsm-bg)' }} className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 style={{ fontWeight: 800, fontSize: '1.6rem', textAlign: 'center', color: 'var(--vsm-black)', marginBottom: '1rem' }}>
          Explora nuestras colecciones
        </h2>
        <p style={{ color: 'var(--vsm-gray-mid)', textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: '14px' }}>
          Encuentra la vela perfecta entre nuestras colecciones artesanales, elaboradas con cera natural e ingredientes seleccionados.
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {subcategories.map(sub => {
              const imgSrc = imageBySubcategory.get(sub.id) ?? ''
              return (
                <Link
                  key={sub.id}
                  to={`/catalogo?categoria=${sub.categoryId}`}
                  style={{
                    backgroundColor: 'var(--vsm-white)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    textDecoration: 'none',
                  }}
                  className="hover:shadow-md transition-shadow"
                >
                  <div style={{
                    backgroundColor: '#FBF6F0',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    overflow: 'hidden',
                  }}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={sub.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      '🕯️'
                    )}
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '13px', textAlign: 'center', color: 'var(--vsm-black)', marginBottom: sub.description ? '4px' : 0 }}>
                      {sub.name}
                    </p>
                    {sub.description && (
                      <p style={{
                        fontSize: '11px',
                        color: 'var(--vsm-gray-mid)',
                        textAlign: 'center',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {sub.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default CandleTypesSection
