import { Link } from 'react-router-dom'
import { footerData } from './FooterLinks'
import logoImg from '../../../assets/Images/Logo.jpeg'

const Footer = () => (
    <footer style={{ backgroundColor: 'var(--vsm-white)', borderTop: '1px solid var(--vsm-gray)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Col 1: Logo + About + Social */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <img
                        src={logoImg}
                        alt="Velas Santa Marta"
                        style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                    />
                    <div>
                        <span style={{ fontWeight: 800, fontSize: '1rem', display: 'block', lineHeight: 1.1, color: 'var(--vsm-black)' }}>Velas</span>
                        <span style={{ fontWeight: 600, fontSize: '0.6rem', color: 'var(--vsm-brand)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Santa Marta</span>
                    </div>
                </div>
                {/* Social icons (placeholder text icons) */}
                <div className="flex gap-3 mt-4">
                    {[
                        { label: 'IG',  href: '#' },
                        { label: 'TK',  href: '#' },
                        { label: 'FB',  href: '#' },
                        { label: 'YT',  href: '#' },
                    ].map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
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
                    Somos una pequeña empresa artesanal nacida en Santa Marta, Colombia.
                    Elaboramos velas a mano con cera natural e ingredientes del Caribe colombiano
                    para crear experiencias únicas en tu hogar.
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
            className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-2"
        >
            <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '12px' }}>
                Copyright © 2025 Velas Santa Marta
            </p>
            <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '12px' }}>
                Santa Marta, Magdalena, Colombia
            </p>
        </div>
    </footer>
)

export default Footer
