import { Link } from 'react-router-dom'
import { footerData } from './FooterLinks'
import logoImg from '../../../assets/Images/Logo.jpeg'
import { useSettings } from '../../../hooks/useSettings'

const FALLBACK_DESCRIPTION = 'Elaboramos velas artesanales a mano con ingredientes naturales seleccionados para crear experiencias únicas en tu hogar.'

const Footer = () => {
  const { settings, loading } = useSettings()
  return (
    <footer style={{ backgroundColor: 'var(--vsm-white)', borderTop: '1px solid var(--vsm-gray)' }} className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">

            {/* Col 1: Logo + About + Social */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    {!loading && (
                        <img
                            src={settings?.logoUrl || logoImg}
                            alt={settings?.storeName || 'Logo'}
                            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                        />
                    )}
                    {settings?.storeName && (
                        <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', lineHeight: 1.2, color: 'var(--vsm-black)' }}>
                            {settings.storeName}
                        </span>
                    )}
                </div>
                {/* Social icons (placeholder text icons) */}
                <div className="flex gap-3 mt-4">
                    {[
                        { label: 'IG', href: settings?.social?.instagram || null },
                        { label: 'FB', href: settings?.social?.facebook  || null },
                    ].filter(s => s.href).map((s) => (
                        <a
                            key={s.label}
                            href={s.href!}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: 'var(--vsm-brand)', color: '#fff',
                                fontSize: '9px', fontWeight: 800,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                textDecoration: 'none',
                            }}
                            className="hover:opacity-80 transition-opacity"
                        >
                            {s.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Col 2: Sobre Nosotros */}
            <div>
                <h3 style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: 'var(--vsm-black)' }}>
                    Sobre Nosotros
                </h3>
                <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', lineHeight: 1.8 }}>
                    {settings?.description || FALLBACK_DESCRIPTION}
                </p>
            </div>

            {/* Col 3 & 4: Dynamic link columns */}
            {footerData.map((section) => (
                <div key={section.title}>
                    <h3 style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: 'var(--vsm-black)' }}>
                        {section.title}
                    </h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {section.links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.path}
                                    style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', textDecoration: 'none' }}
                                    className="hover:text-black transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        {/* Bottom bar */}
        <div
            style={{ borderTop: '1px solid var(--vsm-gray)', marginTop: '3rem', paddingTop: '1.5rem' }}
            className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2"
        >
            <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '12px' }}>
                © {new Date().getFullYear()} Angela Aristizabal · Pereira, Colombia
            </p>
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>
                Diseñado y desarrollado por{' '}
                <a
                    href="https://www.linkedin.com/in/ingesebas"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--vsm-brand)', fontWeight: 700, textDecoration: 'none' }}
                    className="hover:underline"
                >
                    IngeSebas
                </a>
            </p>
        </div>
    </footer>
  )
}

export default Footer
