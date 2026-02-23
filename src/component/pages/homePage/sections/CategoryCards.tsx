import { Link } from "react-router-dom"

const categories = [
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
]

const CategoryCards = () => (
    <section style={{ backgroundColor: 'var(--vsm-white)' }} className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
            <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '2rem' }}>
                Conoce nuestras Velas y otros productos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((item) => (
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
)

export default CategoryCards
