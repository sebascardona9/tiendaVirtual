import { Link } from "react-router-dom"
import juguetesData from "../../component/pages/juguetes/JuguetesData"

const badges: Record<string, { label: string; bg: string; color: string }> = {
    'vela-coco':    { label: 'Nuevo',    bg: '#AEFF00', color: '#000' },
    'vela-sandalo': { label: 'Especial', bg: '#00D4C8', color: '#fff' },
    'vela-lavanda': { label: 'Nuevo',    bg: '#AEFF00', color: '#000' },
    'vela-mar':     { label: 'Especial', bg: '#00D4C8', color: '#fff' },
    'vela-rosa':    { label: 'Nuevo',    bg: '#AEFF00', color: '#000' },
    'vela-canela':  { label: 'Especial', bg: '#00D4C8', color: '#fff' },
}

const CardJuguete = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {juguetesData.map((vela) => {
                const badge = badges[vela.slug]
                return (
                    <div
                        key={vela.slug}
                        style={{
                            backgroundColor: 'var(--vsm-white)',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                        }}
                    >
                        {/* Imagen */}
                        <div style={{ position: 'relative', aspectRatio: '1', backgroundColor: '#F0EBE3' }}>
                            {badge && (
                                <span
                                    style={{
                                        position: 'absolute', top: '8px', left: '8px', zIndex: 1,
                                        backgroundColor: badge.bg, color: badge.color,
                                        fontSize: '10px', fontWeight: 700, padding: '3px 8px',
                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                        borderRadius: '2px',
                                    }}
                                >
                                    {badge.label}
                                </span>
                            )}
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                🕯️
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '1rem' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: 'var(--vsm-black)' }}>
                                {vela.title}
                            </h3>
                            <p style={{ fontSize: '10px', color: 'var(--vsm-gray-mid)', marginBottom: '8px', lineHeight: 1.5 }}>
                                {vela.content}
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--vsm-black)', marginBottom: '12px' }}>
                                ${vela.precio.toLocaleString('es-CO')}
                            </p>
                            <Link
                                to={`/juguetes/${vela.slug}`}
                                style={{
                                    display: 'block', textAlign: 'center',
                                    backgroundColor: 'var(--vsm-brand)', color: '#fff',
                                    fontSize: '11px', fontWeight: 700, padding: '10px',
                                    textTransform: 'uppercase', letterSpacing: '0.07em',
                                    borderRadius: '4px', textDecoration: 'none',
                                }}
                                className="hover:opacity-90 transition-opacity"
                            >
                                Añadir al carrito
                            </Link>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CardJuguete
