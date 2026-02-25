import { useState, useEffect, useRef, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { where } from "firebase/firestore"
import useCollection from "../../../../hooks/useCollection"
import type { Product } from "../../../../types/admin"
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
    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
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

  const [idx, setIdx]       = useState(0)
  const [fading, setFading] = useState(false)
  const fadingRef           = useRef(false)
  const pausedRef           = useRef(false)
  const pauseTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate            = useNavigate()

  // Clamp index if products list shrinks after load
  useEffect(() => {
    if (products.length > 0) setIdx(i => Math.min(i, products.length - 1))
  }, [products.length])

  // Auto-rotate
  useEffect(() => {
    if (products.length < 2) return

    const interval = setInterval(() => {
      if (pausedRef.current || fadingRef.current) return
      fadingRef.current = true
      setFading(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % products.length)
        setFading(false)
        fadingRef.current = false
      }, 200)
    }, AUTO_MS)

    return () => {
      clearInterval(interval)
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [products.length])

  const goTo = (next: number) => {
    if (fadingRef.current) return
    pausedRef.current = true
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => { pausedRef.current = false }, PAUSE_MS)
    fadingRef.current = true
    setFading(true)
    setTimeout(() => {
      setIdx(next)
      setFading(false)
      fadingRef.current = false
    }, 200)
  }

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
        {/* Image */}
        <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: '14px' }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={p.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
              🕯️
            </div>
          )}
        </div>

        {/* Category badge */}
        <span style={{
          backgroundColor: 'var(--vsm-brand)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          borderRadius: '20px',
          display: 'inline-block',
        }}>
          {p.categoryName}
        </span>

        {/* Name */}
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', marginTop: '10px', marginBottom: '4px', lineHeight: 1.3 }}>
          {p.name}
        </p>

        {/* Price */}
        <p style={{ color: 'var(--vsm-brand)', fontWeight: 700, fontSize: '16px' }}>
          ${p.price.toLocaleString('es-CO')}
        </p>
      </div>

      {/* ── Navigation arrows ── */}
      {count > 1 && (
        <>
          <button
            className="hero-carousel-arrow hero-carousel-arrow-left"
            onClick={(e) => { e.stopPropagation(); goTo((idx - 1 + count) % count) }}
            aria-label="Producto anterior"
          >
            ‹
          </button>
          <button
            className="hero-carousel-arrow hero-carousel-arrow-right"
            onClick={(e) => { e.stopPropagation(); goTo((idx + 1) % count) }}
            aria-label="Siguiente producto"
          >
            ›
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {count > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '8px 20px 16px' }}>
          {products.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i) }}
              aria-label={`Producto ${i + 1}`}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: i === idx ? 'var(--vsm-brand)' : 'rgba(255,255,255,0.3)',
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

// ── Hero Section ──────────────────────────────────────────────────────────────
const HeroSection = () => (
  <section
    style={{
      background: 'linear-gradient(135deg, #1A0800 0%, #4A1E05 45%, #8B4513 80%, #C96B2B 100%)',
      minHeight: '520px',
      position: 'relative',
    }}
    className="flex items-center"
  >
    <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

      {/* ── Text ── */}
      <div>
        <span
          style={{ color: '#AEFF00', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          className="block mb-5"
        >
          ✦ Ritual de bienestar
        </span>
        <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Tu nuevo ritual diario<br />de bienestar 🌿
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '440px' }}>
          Velas artesanales elaboradas a mano con cera natural en Santa Marta, Colombia.
          Cada aroma cuenta una historia del Caribe.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/juguetes"
            style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff', borderRadius: '5px', padding: '12px 28px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', textDecoration: 'none' }}
            className="hover:opacity-90 transition-opacity"
          >
            Comprar ahora
          </Link>
          <a
            href="#nosotros"
            style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '5px', padding: '12px 28px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}
            className="hover:bg-white hover:text-black transition-all"
          >
            Ver colección
          </a>
        </div>
      </div>

      {/* ── Carousel ── */}
      <HeroCarousel />

    </div>
  </section>
)

export default HeroSection
