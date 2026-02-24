import { useState, useMemo } from 'react'
import { where } from 'firebase/firestore'
import useCollection from '../../../hooks/useCollection'
import ProductCard from '../../../ui/cards/ProductCard'
import type { Category, Subcategory, Product } from '../../../types/admin'

// ─── Chip styles ─────────────────────────────────────────────────────────────
const chipBase: React.CSSProperties = {
  padding: '6px 16px',
  borderRadius: '20px',
  border: '1px solid transparent',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background-color 0.15s, color 0.15s',
  whiteSpace: 'nowrap',
}

const chipActive: React.CSSProperties = {
  ...chipBase,
  backgroundColor: 'var(--vsm-brand)',
  color: '#fff',
  borderColor: 'var(--vsm-brand)',
}

const chipInactive: React.CSSProperties = {
  ...chipBase,
  backgroundColor: 'var(--vsm-white)',
  color: 'var(--vsm-gray-mid)',
  borderColor: 'var(--vsm-gray)',
}

const subChipActive: React.CSSProperties = {
  ...chipBase,
  padding: '4px 13px',
  fontSize: '12px',
  backgroundColor: 'var(--vsm-brand)',
  color: '#fff',
  borderColor: 'var(--vsm-brand)',
}

const subChipInactive: React.CSSProperties = {
  ...chipBase,
  padding: '4px 13px',
  fontSize: '12px',
  backgroundColor: 'rgba(201,107,43,0.08)',
  color: 'var(--vsm-brand)',
  borderColor: 'rgba(201,107,43,0.3)',
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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

// ─── CatalogPage ──────────────────────────────────────────────────────────────
const CatalogPage = () => {
  const { data: rawCategories,    loading: loadingCats  } = useCollection<Category>('categories', where('active', '==', true))
  const { data: rawSubcategories, loading: loadingSubs  } = useCollection<Subcategory>('subcategories', where('active', '==', true))
  const { data: products,         loading: loadingProds } = useCollection<Product>('products', where('active', '==', true))

  // Sort client-side to avoid composite indexes
  const categories    = useMemo(() => [...rawCategories].sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)), [rawCategories])
  const subcategories = useMemo(() => [...rawSubcategories].sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)), [rawSubcategories])

  const loading = loadingCats || loadingSubs || loadingProds

  const [selectedCategoryId,    setSelectedCategoryId]    = useState<string | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null)

  // Subcategories visible when a category is selected
  const visibleSubcategories = useMemo(
    () => selectedCategoryId
      ? subcategories.filter(s => s.categoryId === selectedCategoryId)
      : [],
    [subcategories, selectedCategoryId],
  )

  // Category IDs and subcategory IDs in active lists (for integrity filter)
  const activeCategoryIds    = useMemo(() => new Set(categories.map(c => c.id)), [categories])
  const activeSubcategoryIds = useMemo(() => new Set(subcategories.map(s => s.id)), [subcategories])

  // Filtered products
  const visibleProducts = useMemo(() => {
    return products.filter(p => {
      // Referential integrity: skip products whose category/sub is no longer active
      if (p.categoryId && !activeCategoryIds.has(p.categoryId)) return false
      if (p.subcategoryId && !activeSubcategoryIds.has(p.subcategoryId)) return false

      if (selectedSubcategoryId) {
        return p.subcategoryId === selectedSubcategoryId
      }
      if (selectedCategoryId) {
        return p.categoryId === selectedCategoryId
      }
      return true
    })
  }, [products, selectedCategoryId, selectedSubcategoryId, activeCategoryIds, activeSubcategoryIds])

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategoryId(id)
    setSelectedSubcategoryId(null)
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--vsm-black)', marginBottom: '1.75rem' }}>
        Catálogo de Velas
      </h1>

      {/* ── Category chips ── */}
      {!loading && categories.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button
            style={selectedCategoryId === null ? chipActive : chipInactive}
            onClick={() => handleSelectCategory(null)}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={selectedCategoryId === cat.id ? chipActive : chipInactive}
              onClick={() => handleSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Subcategory chips ── */}
      {!loading && visibleSubcategories.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', paddingLeft: '0.25rem' }}>
          <button
            style={selectedSubcategoryId === null ? subChipActive : subChipInactive}
            onClick={() => setSelectedSubcategoryId(null)}
          >
            Todo
          </button>
          {visibleSubcategories.map(sub => (
            <button
              key={sub.id}
              style={selectedSubcategoryId === sub.id ? subChipActive : subChipInactive}
              onClick={() => setSelectedSubcategoryId(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Products grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--vsm-gray-mid)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No hay productos disponibles en esta categoría.</p>
          {selectedCategoryId && (
            <button
              onClick={() => handleSelectCategory(null)}
              style={{ marginTop: '1rem', color: 'var(--vsm-brand)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, textDecoration: 'underline', fontFamily: 'inherit' }}
            >
              Ver todos los productos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default CatalogPage
