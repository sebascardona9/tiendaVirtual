import { Link, Outlet } from "react-router-dom"
import useCollection from "../../../../hooks/useCollection"
import ProductCard from "../../../../ui/cards/ProductCard"
import type { Product } from "../../../../types/admin"

const SkeletonCard = () => (
  <div style={{
    backgroundColor: 'var(--vsm-white)',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  }}>
    <div style={{ aspectRatio: '1', backgroundColor: 'var(--vsm-gray)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ height: '13px', backgroundColor: 'var(--vsm-gray)', borderRadius: '3px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '10px', backgroundColor: 'var(--vsm-gray)', borderRadius: '3px', width: '90%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '20px', backgroundColor: 'var(--vsm-gray)', borderRadius: '3px', width: '45%', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  </div>
)

const ProductsSection = () => {
  const { data: products, loading } = useCollection<Product>('products')

  return (
    <section style={{ backgroundColor: 'var(--vsm-bg)' }} className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '1.75rem' }}>
          Nuestros Productos
        </h2>

        <Outlet />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px' }}>
            No hay productos disponibles aún.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link
                to="/juguetes"
                style={{ color: 'var(--vsm-brand)', fontWeight: 700, fontSize: '13px', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Ver todos los productos →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ProductsSection
