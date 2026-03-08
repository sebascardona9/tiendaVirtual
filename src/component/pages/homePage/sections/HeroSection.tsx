import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { where } from "firebase/firestore"
import useCollection from "../../../../hooks/useCollection"
import { useCarousel } from "../../../../hooks/useCarousel"
import { useSettings } from "../../../../hooks/useSettings"
import type { Product, StoreSettings } from "../../../../types/admin"
import './HeroSection.css'

const CAROUSEL_MAX = 8
const AUTO_MS      = 3000
const PAUSE_MS     = 5000

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <div className="hero-carousel-container" style={{ minHeight: '380px', padding: '24px' }}>
    <div className="hero-skeleton-block" style={{ height: '210px', borderRadius: '8px', marginBottom: '16px' }} />
    <div className="hero-skeleton-block" style={{ height: '14px', width: '64px', borderRadius: '20px', marginBottom: '12px' }} />
    <div className="hero-skeleton-block" style={{ height: '18px', width: '72%', borderRadius: '4px', marginBottom: '8px' }} />
    <div className="hero-skeleton-block" style={{ height: '16px', width: '38%', borderRadius: '4px' }} />
  </div>
)

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyCarousel = () => (
  <div
    className="hero-carousel-container"
    style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
  >
    <span style={{ fontSize: '5rem', filter: 'drop-shadow(0 8px 20px rgba(201,107,43,0.6))' }}>🕯️</span>
    <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      Próximamente nuevos productos
    </p>
  </div>
)

// ── Carousel ──────────────────────────────────────────────────────────────────
const HeroCarousel = () => {
  const { data: raw, loading } = useCollection<Product>('products', where('active', '==', true))

  const products = useMemo(() =>
    [...raw]
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
      .slice(0, CAROUSEL_MAX),
    [raw]
  )

  const navigate = useNavigate()
  const { idx, fading, goTo } = useCarousel({
    count: products.length,
    autoIntervalMs: AUTO_MS,
    pauseAfterMs: PAUSE_MS,
  })

  if (loading) return <CarouselSkeleton />
  if (products.length === 0) return <EmptyCarousel />

  const p      = products[Math.min(idx, products.length - 1)]
  const imgSrc = p.images?.[0] ?? p.imageUrl ?? ''
  const count  = products.length

  return (
    <div className="hero-carousel-container">

      {/* ── Slide ── */}
      <div
        onClick={() => navigate(`/producto/${p.id}`)}
        style={{ cursor: 'pointer', opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease', padding: '20px 20px 12px' }}
      >
        <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--vsm-bg)', marginBottom: '14px' }}>
          {imgSrc ? (
            <img src={imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>🕯️</div>
          )}
        </div>

        <span style={{
          backgroundColor: 'var(--vsm-brand)', color: '#fff',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '3px 10px',
          borderRadius: '20px', display: 'inline-block',
        }}>
          {p.categoryName}
        </span>

        <p style={{ color: 'var(--vsm-black)', fontWeight: 700, fontSize: '15px', marginTop: '10px', marginBottom: '4px', lineHeight: 1.3 }}>
          {p.name}
        </p>
        <p style={{ color: 'var(--vsm-brand)', fontWeight: 700, fontSize: '16px' }}>
          ${p.price.toLocaleString('es-CO')}
        </p>
      </div>

      {count > 1 && (
        <>
          <button className="hero-carousel-arrow hero-carousel-arrow-left"
            onClick={(e) => { e.stopPropagation(); goTo((idx - 1 + count) % count) }}
            aria-label="Producto anterior">‹</button>
          <button className="hero-carousel-arrow hero-carousel-arrow-right"
            onClick={(e) => { e.stopPropagation(); goTo((idx + 1) % count) }}
            aria-label="Siguiente producto">›</button>
        </>
      )}

      {count > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '8px 20px 16px' }}>
          {products.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i) }}
              aria-label={`Producto ${i + 1}`}
              style={{
                width: '7px', height: '7px', borderRadius: '50%', border: 'none',
                backgroundColor: i === idx ? 'var(--vsm-brand)' : 'var(--vsm-gray)',
                cursor: 'pointer', padding: 0, transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const HERO_DEFAULTS = {
  eyebrow:   '✦ Ritual de bienestar',
  titulo:    'Tu nuevo ritual diario de bienestar 🌿',
  subtitulo: 'Velas artesanales elaboradas a mano con cera natural en Santa Marta, Colombia. Cada aroma cuenta una historia del Caribe.',
}

// ── Texto + CTA del hero ───────────────────────────────────────────────────────
const HeroText = ({ light, settings }: { light: boolean; settings: StoreSettings | null }) => {
  const eyebrow   = settings?.heroEyebrow   || HERO_DEFAULTS.eyebrow
  const titulo    = settings?.heroTitulo    || HERO_DEFAULTS.titulo
  const subtitulo = settings?.heroSubtitulo || HERO_DEFAULTS.subtitulo

  return (
    <div>
      <span
        style={{ color: light ? 'rgba(255,255,255,0.75)' : 'var(--vsm-brand)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
        className="block mb-5"
      >
        {eyebrow}
      </span>
      <h1 style={{ color: light ? '#fff' : 'var(--vsm-black)', fontSize: 'clamp(1.6rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
        {titulo}
      </h1>
      <p style={{ color: light ? 'rgba(255,255,255,0.75)' : 'var(--vsm-gray-mid)', fontSize: '15px', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '440px' }}>
        {subtitulo}
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/catalogo"
          style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff', borderRadius: '5px', padding: '12px 28px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', textDecoration: 'none' }}
          className="hover:opacity-90 transition-opacity"
        >
          Comprar ahora
        </Link>
        <a
          href="#nosotros"
          style={{
            color: light ? '#fff' : 'var(--vsm-brand)',
            border: `1px solid ${light ? 'rgba(255,255,255,0.5)' : 'var(--vsm-brand)'}`,
            borderRadius: '5px', padding: '12px 28px', fontSize: '13px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.07em', textDecoration: 'none',
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Ver colección
        </a>
      </div>
    </div>
  )
}

// ── Hero Section ──────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { settings, loading: settingsLoading } = useSettings()
  const [videoFailed, setVideoFailed] = useState(false)

  const videoUrl  = settings?.heroVideoURL
  const showVideo = !settingsLoading && !!videoUrl && !videoFailed

  return (
    <section
      style={{
        backgroundColor: showVideo ? 'var(--vsm-black)' : 'var(--vsm-bg-warm)',
        minHeight: '520px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="flex items-center"
    >
      {/* ── Fondo de video ── */}
      {showVideo && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={videoUrl!} />
          </video>
          {/* Overlay oscuro para legibilidad del texto */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(26,18,8,0.60)',
          }} />
        </>
      )}

      {/* ── Contenido ── */}
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-20"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <HeroText light={showVideo} settings={settings} />

        {/* Carrusel solo en modo sin video */}
        {!showVideo && <HeroCarousel />}
      </div>
    </section>
  )
}

export default HeroSection
