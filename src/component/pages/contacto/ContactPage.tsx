import { useSettings } from '../../../hooks/useSettings'
import FadeIn         from './components/FadeIn'
import InfoCard        from './components/InfoCard'
import WhatsAppButton  from './components/WhatsAppButton'
import InstagramLink   from './components/InstagramLink'
import ContactForm     from './components/ContactForm'

const ContactPage = () => {
  const { settings } = useSettings()

  return (
    <div>

      {/* ── Hero ── */}
      <section
        style={{ background: '#1A1208', minHeight: '45vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
        className="pt-16 md:pt-36 pb-10 md:pb-24 px-4 md:px-8"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,115,42,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '11px', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,146,74,0.9)', marginBottom: '1.5rem' }}>
            <span style={{ width: '48px', height: '1px', background: '#C8732A', opacity: 0.5, display: 'block' }} />
            Estamos aquí para ti
            <span style={{ width: '48px', height: '1px', background: '#C8732A', opacity: 0.5, display: 'block' }} />
          </div>
          <h1 style={{ color: '#F5EFE4', fontSize: 'clamp(2rem, 8vw, 6rem)', fontWeight: 300, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
            ¿<em style={{ fontStyle: 'italic', color: 'rgba(232,146,74,0.95)' }}>Hablamos</em>?
          </h1>
          <p style={{ color: 'rgba(245,239,228,0.6)', fontSize: '15px', fontWeight: 300, lineHeight: 1.8, maxWidth: '420px', margin: '0 auto' }}>
            Estamos en Pereira, Colombia.<br />Escríbenos y te respondemos pronto.
          </p>
        </div>

        <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', fontSize: '2.5rem', lineHeight: 1, filter: 'drop-shadow(0 0 20px rgba(200,115,42,0.8))', opacity: 0.5 }}>
          🕯️
        </div>
      </section>

      {/* ── Main: dos columnas ── */}
      <section style={{ backgroundColor: 'var(--vsm-bg)' }} className="py-12 md:py-20 px-4 md:px-8">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Columna izquierda — info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FadeIn delay={0}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--vsm-black)', marginBottom: '0.25rem' }}>
                Información de contacto
              </h2>
              <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Contáctanos por cualquiera de estos medios o visítanos en nuestra ubicación.
              </p>
            </FadeIn>
            <FadeIn delay={80}>
              <InfoCard icon="📍" label="Dirección" value={settings?.address ?? ''} />
            </FadeIn>
            <FadeIn delay={140}>
              <InfoCard icon="📧" label="Correo electrónico" value={settings?.email ?? ''}
                href={settings?.email ? `mailto:${settings.email}` : undefined} />
            </FadeIn>
            <FadeIn delay={200}>
              <InfoCard icon="📱" label="Teléfono / WhatsApp" value={settings?.phone ?? ''} />
            </FadeIn>
            <FadeIn delay={260}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', marginTop: '0.5rem' }}>
                <WhatsAppButton phone={settings?.phone ?? ''} />
                <InstagramLink  url={settings?.social?.instagram ?? ''} />
              </div>
            </FadeIn>
          </div>

          {/* Columna derecha — formulario */}
          <FadeIn delay={150}>
            <div style={{ backgroundColor: 'var(--vsm-white)', borderRadius: '16px', padding: 'var(--vsm-pad-modal)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--vsm-black)', marginBottom: '1.5rem' }}>
                Envíanos un mensaje
              </h3>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Quote banner ── */}
      <section
        style={{ background: 'linear-gradient(135deg, #1A0800 0%, #2D1200 100%)', textAlign: 'center' }}
        className="py-12 md:py-20 px-4 md:px-8"
      >
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          ✦ {settings?.storeName || 'Nuestra tienda'}
        </p>
        <blockquote style={{ color: '#fff', fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.5, maxWidth: '600px', margin: '0 auto', fontStyle: 'italic' }}>
          "Cada vela cuenta una historia diferente"
        </blockquote>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '1rem' }}>
          Hecha a mano con amor desde el eje cafetero colombiano
        </p>
      </section>
    </div>
  )
}

export default ContactPage
