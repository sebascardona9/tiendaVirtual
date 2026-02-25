import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, getDocs, doc, collection } from 'firebase/firestore'
import { db } from '../../../firebase/firebase.config'
import type { Product, Category } from '../../../types/admin'
import { formatCOP } from '../../../utils/formatters'

// ── Skeleton ───────────────────────────────────────────────────────────────

const SkeletonDetail = () => (
  <div className="w-full" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
    {/* Back button skeleton */}
    <div style={{
      width: '140px', height: '14px',
      backgroundColor: 'var(--vsm-gray)', borderRadius: '4px',
      marginBottom: '2rem', animation: 'pulse 1.5s ease-in-out infinite',
    }} />

    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12">
      {/* Left */}
      <div>
        <div style={{
          aspectRatio: '1', backgroundColor: 'var(--vsm-gray)',
          borderRadius: '12px', animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '72px', height: '72px',
              backgroundColor: 'var(--vsm-gray)', borderRadius: 'var(--vsm-radius)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[{ w: '80px', h: '24px', r: '20px' }, { w: '75%', h: '36px', r: '6px' }, { w: '45%', h: '32px', r: '6px' }, { w: '100%', h: '80px', r: '6px' }].map((s, i) => (
          <div key={i} style={{
            width: s.w, height: s.h,
            backgroundColor: 'var(--vsm-gray)', borderRadius: s.r,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
        <div style={{
          width: '100%', height: '50px',
          backgroundColor: 'var(--vsm-gray)', borderRadius: 'var(--vsm-radius)',
          marginTop: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  </div>
)

// ── 404 ────────────────────────────────────────────────────────────────────

const NotFoundProduct = () => (
  <div style={{
    maxWidth: '560px', margin: '5rem auto',
    padding: '2rem', textAlign: 'center',
  }}>
    <h2 style={{
      fontSize: '1.5rem', fontWeight: 800,
      color: 'var(--vsm-black)', marginBottom: '0.75rem',
    }}>
      Producto no encontrado
    </h2>
    <p style={{ color: 'var(--vsm-gray-mid)', marginBottom: '2rem', lineHeight: 1.6 }}>
      El producto que buscas no existe o fue eliminado.
    </p>
    <Link
      to="/juguetes"
      style={{
        color: 'var(--vsm-brand)', fontWeight: 600,
        textDecoration: 'underline', textUnderlineOffset: '3px',
      }}
    >
      Volver al catalogo
    </Link>
  </div>
)

// ── Main component ─────────────────────────────────────────────────────────

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()

  const [product,   setProduct]   = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,   setLoading]   = useState(true)
  const [notFound,  setNotFound]  = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading,    setFading]    = useState(false)
  const [zoomed,    setZoomed]    = useState(false)
  const [quantity,  setQuantity]  = useState(1)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setNotFound(false)
    setActiveIdx(0)
    setQuantity(1)

    Promise.all([
      getDoc(doc(db, 'products', id)),
      getDocs(collection(db, 'categories')),
    ])
      .then(([productSnap, categoriesSnap]) => {
        if (!productSnap.exists()) { setNotFound(true); return }
        setProduct({ id: productSnap.id, ...productSnap.data() } as Product)
        setCategories(categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)            return <SkeletonDetail />
  if (notFound || !product) return <NotFoundProduct />

  const imgs = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : []

  const categoryName = categories.find(c => c.id === product.categoryId)?.name ?? ''
  const outOfStock   = product.stock === 0

  const handleThumbnail = (i: number) => {
    if (i === activeIdx) return
    setFading(true)
    setTimeout(() => { setActiveIdx(i); setFading(false) }, 150)
  }

  return (
    <div className="w-full" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* ── Back button ───────────────────────────────────────────── */}
      <Link
        to="/juguetes"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          color: 'var(--vsm-gray-mid)', textDecoration: 'none',
          fontSize: '13px', fontWeight: 500, marginBottom: '2rem',
        }}
      >
        &larr; Volver al catalogo
      </Link>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12">

        {/* ── LEFT: image gallery ──────────────────────────────────── */}
        <div>
          {/* Main image */}
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--vsm-gray)',
              aspectRatio: '1',
              backgroundColor: 'var(--vsm-bg-warm)',
              cursor: imgs.length > 0 ? 'zoom-in' : 'default',
            }}
          >
            {imgs.length > 0 ? (
              <img
                src={imgs[activeIdx]}
                alt={product.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                  opacity: fading ? 0 : 1,
                  transform: zoomed ? 'scale(1.08)' : 'scale(1)',
                  transition: 'opacity 0.15s ease, transform 0.35s ease',
                }}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--vsm-gray-mid)', fontSize: '14px',
              }}>
                Sin imagen
              </div>
            )}
          </div>

          {/* Thumbnails — only when more than 1 image */}
          {imgs.length > 1 && (
            <div style={{
              display: 'flex', gap: '0.75rem',
              marginTop: '1rem', overflowX: 'auto', paddingBottom: '4px',
            }}>
              {imgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => handleThumbnail(i)}
                  style={{
                    flexShrink: 0, width: '72px', height: '72px',
                    borderRadius: 'var(--vsm-radius)', overflow: 'hidden',
                    border: `2px solid ${i === activeIdx ? 'var(--vsm-brand)' : 'var(--vsm-gray)'}`,
                    padding: 0, cursor: 'pointer',
                    backgroundColor: 'var(--vsm-bg-warm)',
                    transition: 'border-color 0.2s', outline: 'none',
                  }}
                >
                  <img
                    src={src}
                    alt={`Vista ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: product info ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Category badge */}
          {categoryName && (
            <span style={{
              display: 'inline-block', alignSelf: 'flex-start',
              backgroundColor: 'var(--vsm-gray)', color: 'var(--vsm-gray-mid)',
              padding: '0.3rem 0.9rem', borderRadius: '20px',
              fontSize: '11px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {categoryName}
            </span>
          )}

          {/* Name */}
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800,
            color: 'var(--vsm-black)', lineHeight: 1.2, margin: 0,
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--vsm-brand)', margin: 0 }}>
            {formatCOP(product.price)}
          </p>

          {/* Description */}
          <p style={{ fontSize: '14px', color: 'var(--vsm-gray-mid)', lineHeight: 1.8, margin: 0 }}>
            {product.description}
          </p>

          {/* Aroma block — rendered only when field exists */}
          {product.aroma && (
            <div style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#FFF7F0',
              borderLeft: '3px solid var(--vsm-brand)',
              borderRadius: '0 8px 8px 0',
            }}>
              <strong style={{
                display: 'block', color: 'var(--vsm-brand)',
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.06em', marginBottom: '0.3rem',
              }}>
                Aroma
              </strong>
              <span style={{ color: 'var(--vsm-black)', fontSize: '14px' }}>
                {product.aroma}
              </span>
            </div>
          )}

          {/* Stock status */}
          <p style={{
            fontSize: '13px', fontWeight: 600, margin: 0,
            color: outOfStock ? 'var(--vsm-error)' : 'var(--vsm-success)',
          }}>
            {outOfStock ? 'Sin stock' : `${product.stock} disponibles`}
          </p>

          {/* Quantity selector — hidden when out of stock */}
          {!outOfStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 500 }}>
                Cantidad:
              </span>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                border: '1px solid var(--vsm-gray)', borderRadius: 'var(--vsm-radius)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: '40px', height: '40px', border: 'none',
                    backgroundColor: 'transparent', cursor: 'pointer',
                    fontSize: '1.1rem', fontWeight: 600, color: 'var(--vsm-black)',
                  }}
                >
                  &minus;
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{
                    width: '40px', height: '40px', border: 'none',
                    backgroundColor: 'transparent', cursor: 'pointer',
                    fontSize: '1.1rem', fontWeight: 600, color: 'var(--vsm-black)',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            disabled={outOfStock}
            style={{
              padding: '14px 24px',
              backgroundColor: outOfStock ? 'var(--vsm-gray)' : 'var(--vsm-brand)',
              color: outOfStock ? 'var(--vsm-gray-mid)' : '#fff',
              border: 'none', borderRadius: 'var(--vsm-radius)',
              fontSize: '14px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.07em',
              cursor: outOfStock ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            {outOfStock ? 'Agotado' : 'Agregar al carrito'}
          </button>

          {/* Shipping */}
          <p style={{
            textAlign: 'center', color: 'var(--vsm-gray-mid)',
            fontSize: '12px', margin: 0,
          }}>
            Envio disponible a todo el pais
          </p>

        </div>
      </div>
    </div>
  )
}

export default ProductDetail
