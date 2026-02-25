import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/admin'
import { formatCOP } from '../../utils/formatters'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false)

  // images[] toma precedencia; si no existe se usa imageUrl como única imagen
  const imgs = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : []

  const hasSecond = imgs.length >= 2

  return (
    <div
      style={{
        backgroundColor: 'var(--vsm-white)',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: 'var(--vsm-shadow)',
      }}
    >
      {/* Imagen con crossfade al hover */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1',
          backgroundColor: 'var(--vsm-bg-warm)',
          overflow: 'hidden',
          cursor: hasSecond ? 'pointer' : 'default',
        }}
        onMouseEnter={() => hasSecond && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {product.stock === 0 && (
          <span
            style={{
              position: 'absolute', top: '8px', left: '8px', zIndex: 2,
              backgroundColor: 'var(--vsm-error)', color: '#fff',
              fontSize: '10px', fontWeight: 700, padding: '3px 8px',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              borderRadius: '2px',
            }}
          >
            Agotado
          </span>
        )}

        {imgs.length > 0 ? (
          <>
            <img
              src={imgs[0]}
              alt={product.name}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: hovered ? 0 : 1,
                transition: 'opacity 0.4s ease',
              }}
            />
            {imgs[1] && (
              <img
                src={imgs[1]}
                alt={product.name}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%', objectFit: 'cover',
                  opacity: hovered ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🕯️</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: 'var(--vsm-black)' }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '10px', color: 'var(--vsm-gray-mid)', marginBottom: '8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--vsm-black)', marginBottom: '12px' }}>
          {formatCOP(product.price)}
        </p>
        <Link
          to={`/producto/${product.id}`}
          style={{
            display: 'block', textAlign: 'center',
            backgroundColor: product.stock === 0 ? 'var(--vsm-gray-mid)' : 'var(--vsm-brand)',
            color: '#fff',
            fontSize: '11px', fontWeight: 700, padding: '10px',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            borderRadius: '4px', textDecoration: 'none',
            pointerEvents: product.stock === 0 ? 'none' : 'auto',
          }}
          className="hover:opacity-90 transition-opacity"
        >
          {product.stock === 0 ? 'Agotado' : 'Ver producto'}
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
