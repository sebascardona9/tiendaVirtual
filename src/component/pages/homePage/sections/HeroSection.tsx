import { Link } from "react-router-dom"

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
            {/* Text */}
            <div>
                <span
                    style={{ color: '#AEFF00', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
                    className="block mb-5"
                >
                    ✦ Ritual de bienestar
                </span>
                <h1
                    style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}
                >
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

            {/* Imagen placeholder */}
            <div
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', minHeight: '340px' }}
                className="hidden lg:flex items-center justify-center flex-col gap-4"
            >
                <span style={{ fontSize: '6rem', filter: 'drop-shadow(0 8px 20px rgba(201,107,43,0.6))' }}>🕯️</span>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Colección Santa Marta
                </p>
            </div>
        </div>
    </section>
)

export default HeroSection
