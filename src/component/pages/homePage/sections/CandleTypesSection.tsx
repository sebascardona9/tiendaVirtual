import { Link } from "react-router-dom"

const velaTipos = [
    { icon: '🌿', name: 'Velas de Soya'         },
    { icon: '🍯', name: 'Velas de Cera de Abeja' },
    { icon: '🌸', name: 'Velas Decorativas'     },
    { icon: '💐', name: 'Velas Aromáticas'      },
]

const CandleTypesSection = () => (
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
)

export default CandleTypesSection
