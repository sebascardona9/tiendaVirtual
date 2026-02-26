import { useNavigate } from 'react-router-dom'
import { useCarousel } from '../../hooks/useCarousel'
import type { Product } from '../../types/admin'

interface ProductCarouselProps {
  products: Product[]
  autoIntervalMs?: number
  pauseAfterMs?: number
}

const ProductCarousel = ({ products, autoIntervalMs = 3000, pauseAfterMs = 5000 }: ProductCarouselProps) => {
  const navigate = useNavigate()
  const count = products.length
  const { idx, fading, goTo } = useCarousel({ count, autoIntervalMs, pauseAfterMs })

  if (count === 0) {
    return (
      <div style={{
        aspectRatio: '4/3',
        backgroundColor: '#FBF6F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
      }}>
        🕯️
      </div>
    )
  }

  const p      = products[Math.min(idx, count - 1)]
  const imgSrc = p.images?.[0] ?? p.imageUrl ?? ''

  return (
    <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#FBF6F0' }}>
      {/* ── Slide ── */}
      <div
        onClick={() => navigate(`/producto/${p.id}`)}
        style={{
          aspectRatio: '4/3',
          cursor: 'pointer',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={p.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
          }}>
            🕯️
          </div>
        )}
      </div>

      {/* ── Navigation arrows ── */}
      {count > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo((idx - 1 + count) % count) }}
            aria-label="Imagen anterior"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0,0,0,0.35)',
              color: '#fff',
              fontSize: '18px',
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo((idx + 1) % count) }}
            aria-label="Siguiente imagen"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0,0,0,0.35)',
              color: '#fff',
              fontSize: '18px',
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            ›
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {count > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '5px',
        }}>
          {products.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i) }}
              aria-label={`Imagen ${i + 1}`}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: i === idx ? 'var(--vsm-brand)' : 'rgba(0,0,0,0.25)',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductCarousel
