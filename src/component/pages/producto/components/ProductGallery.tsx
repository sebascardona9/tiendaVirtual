import { useState } from 'react'

interface Props {
  imgs: string[]
  name: string
}

const ProductGallery = ({ imgs, name }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading,    setFading]    = useState(false)
  const [zoomed,    setZoomed]    = useState(false)

  const handleThumbnail = (i: number) => {
    if (i === activeIdx) return
    setFading(true)
    setTimeout(() => { setActiveIdx(i); setFading(false) }, 150)
  }

  return (
    <div>
      {/* Main image */}
      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        border: '1px solid var(--vsm-gray)', aspectRatio: '1',
        backgroundColor: 'var(--vsm-bg-warm)',
        cursor: imgs.length > 0 ? 'zoom-in' : 'default',
      }}>
        {imgs.length > 0 ? (
          <img
            src={imgs[activeIdx]}
            alt={name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity:    fading ? 0 : 1,
              transform:  zoomed ? 'scale(1.08)' : 'scale(1)',
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
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '4px' }}>
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
  )
}

export default ProductGallery
