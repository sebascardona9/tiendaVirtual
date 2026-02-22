import { Link, Outlet } from "react-router-dom"
import CardJuguete from "../../../ui/cards/juguete"

const velaTipos = [
    { icon: '🌿', name: 'Velas de Soya'        },
    { icon: '🍯', name: 'Velas de Cera de Abeja'},
    { icon: '🌸', name: 'Velas Decorativas'    },
    { icon: '💐', name: 'Velas Aromáticas'     },
]

const reviews = [
    {
        stars: 5,
        text: '"Las velas más hermosas que he tenido. El aroma a coco me transporta directamente al Caribe. ¡Las recomiendo 100%!"',
        author: 'María Martínez, Bogotá',
    },
    {
        stars: 5,
        text: '"Compré el pack de lavanda y sándalo para regalar y quedaron fascinados. La presentación es preciosa y el aroma dura muchísimo."',
        author: 'Andrés Gómez, Medellín',
    },
    {
        stars: 5,
        text: '"Calidad artesanal increíble. Se nota que están hechas con amor y buenos materiales. Ya pedí mi tercer pedido."',
        author: 'Lucía Herrera, Cali',
    },
]

const HomePage = () => (
    <div className="w-full">

        {/* ── Hero Banner ── */}
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

        {/* ── "Conoce nuestras Velas" ── */}
        <section style={{ backgroundColor: 'var(--vsm-white)' }} className="py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '2rem' }}>
                    Conoce nuestras Velas y otros productos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            icon: '🕯️',
                            title: 'Velas Aromáticas',
                            desc: 'Elaboradas con cera de soya 100% natural y aceites esenciales puros. Cada vela llena tu espacio con aromas únicos inspirados en el Caribe colombiano: coco, mar, flores tropicales y especias.',
                        },
                        {
                            icon: '🌸',
                            title: 'Velas Decorativas',
                            desc: 'Diseños artesanales únicos que combinan belleza y aroma. Cada pieza es moldeada y terminada a mano, convirtiéndose en un objeto decorativo que también perfuma tu hogar.',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            style={{ backgroundColor: '#FBF6F0', borderRadius: '8px', padding: '2rem', borderLeft: '3px solid var(--vsm-brand)' }}
                        >
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--vsm-black)' }}>
                                {item.title}
                            </h3>
                            <p style={{ color: 'var(--vsm-gray-mid)', lineHeight: 1.8, fontSize: '14px', marginBottom: '1.25rem' }}>
                                {item.desc}
                            </p>
                            <Link
                                to="/juguetes"
                                style={{ color: 'var(--vsm-brand)', fontWeight: 700, fontSize: '13px', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                            >
                                Ver productos →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Nuestros Productos ── */}
        <section style={{ backgroundColor: 'var(--vsm-bg)' }} className="py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '1.75rem' }}>
                    Nuestros Productos
                </h2>
                <Outlet />
                <CardJuguete />
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <Link
                        to="/juguetes"
                        style={{ color: 'var(--vsm-brand)', fontWeight: 700, fontSize: '13px', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                    >
                        Ver todos los productos →
                    </Link>
                </div>
            </div>
        </section>

        {/* ── Tipos de Velas ── */}
        <section style={{ backgroundColor: 'var(--vsm-white)' }} className="py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', textAlign: 'center', color: 'var(--vsm-black)', marginBottom: '1rem' }}>
                    Tipos de Velas Artesanales
                </h2>
                <p style={{ color: 'var(--vsm-gray-mid)', textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: '14px' }}>
                    Ofrecemos más de 6 tipos de velas artesanales con variedad de diseños y más de 10 aromas exclusivos
                    para crear la experiencia perfecta en tu hogar o como regalo especial.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {velaTipos.map((tipo) => (
                        <Link
                            key={tipo.name}
                            to="/juguetes"
                            style={{
                                backgroundColor: 'var(--vsm-white)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                textDecoration: 'none',
                            }}
                            className="hover:shadow-md transition-shadow"
                        >
                            <div
                                style={{ backgroundColor: '#FBF6F0', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                            >
                                {tipo.icon}
                            </div>
                            <p
                                style={{ fontWeight: 700, fontSize: '13px', padding: '0.75rem', textAlign: 'center', color: 'var(--vsm-black)' }}
                            >
                                {tipo.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Lo que dicen nuestros clientes ── */}
        <section id="nosotros" style={{ backgroundColor: 'var(--vsm-bg)' }} className="py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', textAlign: 'center', color: 'var(--vsm-black)', marginBottom: '2.5rem' }}>
                    Lo que dicen nuestros clientes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((r, i) => (
                        <div
                            key={i}
                            style={{ backgroundColor: 'var(--vsm-white)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                        >
                            <div style={{ fontSize: '14px', color: '#F5A623', marginBottom: '0.75rem' }}>
                                {'★'.repeat(r.stars)}
                            </div>
                            <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.75, marginBottom: '1rem', fontStyle: 'italic' }}>
                                {r.text}
                            </p>
                            <p style={{ fontWeight: 700, fontSize: '12px', color: 'var(--vsm-black)' }}>
                                — {r.author}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Newsletter / 10% OFF ── */}
        <section
            style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff' }}
            className="py-16 px-8 text-center"
        >
            <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                Regístrate y obtén 10% OFF
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.85, marginBottom: '2rem' }}>
                en tu primera compra
            </p>
            <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    type="email"
                    placeholder="tu@correo.com"
                    style={{
                        flex: 1, padding: '12px 16px', borderRadius: '5px',
                        border: 'none', fontSize: '14px', outline: 'none',
                        color: 'var(--vsm-black)',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#111', color: '#fff', padding: '12px 24px',
                        borderRadius: '5px', border: 'none', fontSize: '12px',
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                    className="hover:opacity-90 transition-opacity"
                >
                    Obtener mi 10% OFF
                </button>
            </form>
        </section>

    </div>
)

export default HomePage
