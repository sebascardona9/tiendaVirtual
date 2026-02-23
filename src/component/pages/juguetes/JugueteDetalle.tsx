import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../../firebase/firebase.config'
import type { Product } from '../../../types/admin'

const JugueteDetalle = () => {
  const { slug } = useParams()

  const [product,  setProduct]  = useState<Product | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading,   setFading]   = useState(false)
  const [zoomed,   setZoomed]   = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setActiveIdx(0)
    getDoc(doc(db, 'products', slug))
      .then(snap => {
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product)
        else setNotFound(true)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div style={{ padding: '2rem', color: 'var(--vsm-gray-mid)', fontSize: '14px' }}>
      Cargando producto...
    </div>
  )

  if (notFound || !product) return (
    <div style={{ padding: '2rem', color: 'var(--vsm-gray-mid)', fontSize: '14px' }}>
      Producto no encontrado.
    </div>
  )

  // Normalizar imágenes: images[] toma precedencia, si no existe usa imageUrl
  const imgs = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : []

  const handleThumbnail = (i: number) => {
    if (i === activeIdx) return
    setFading(true)
    setTimeout(() => {
      setActiveIdx(i)
      setFading(false)
    }, 150)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--vsm-white)',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        marginBottom: '2rem',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── Galería ── */}
        <div>
          {/* Imagen principal con zoom */}
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--vsm-gray)',
              aspectRatio: '1',
              backgroundColor: '#F0EBE3',
              cursor: imgs.length > 0 ? 'zoom-in' : 'default',
            }}
          >
            {imgs.length > 0 ? (
              <img
                src={imgs[activeIdx]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: fading ? 0 : 1,
                  transform: zoomed ? 'scale(1.08)' : 'scale(1)',
                  transition: 'opacity 0.15s ease, transform 0.35s ease',
                }}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '5rem' }}>
                🕯️
              </div>
            )}
          </div>

          {/* Miniaturas (solo si hay más de 1 imagen) */}
          {imgs.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}
            >
              {imgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => handleThumbnail(i)}
                  style={{
                    flexShrink: 0,
                    width: '64px',
                    height: '64px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: i === activeIdx
                      ? '2px solid var(--vsm-brand)'
                      : '2px solid var(--vsm-gray)',
                    padding: 0,
                    cursor: 'pointer',
                    backgroundColor: '#F0EBE3',
                    transition: 'border-color 0.2s',
                    outline: 'none',
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

        {/* ── Info del producto ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--vsm-black)', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--vsm-brand)' }}>
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}
          </p>

          <p style={{ fontSize: '14px', color: 'var(--vsm-gray-mid)', lineHeight: 1.8 }}>
            {product.description}
          </p>

          <p style={{
            fontSize: '13px',
            fontWeight: 600,
            color: product.stock === 0 ? '#DC2626' : '#16A34A',
          }}>
            {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
          </p>

          <button
            disabled={product.stock === 0}
            style={{
              marginTop: 'auto',
              backgroundColor: product.stock === 0 ? 'var(--vsm-gray)' : 'var(--vsm-brand)',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '13px 24px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default JugueteDetalle
