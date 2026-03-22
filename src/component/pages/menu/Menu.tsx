import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/authContext"
import { useSettings } from '../../../hooks/useSettings'
import { useCartContext } from '../../../context/CartContext'
import logoImg from '../../../assets/Images/Logo.jpeg'

const navLinks = [
    { to: '/',         text: 'Inicio'      },
    { to: '/catalogo', text: '+ Productos' },
    { to: '/#nosotros',text: 'Nosotros'   },
    { to: '/contacto', text: 'Contacto'   },
]

const Menu = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { settings, loading } = useSettings()
    const { totalItems } = useCartContext()
    const logoSrc = loading ? null : (settings?.logoUrl || logoImg)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (loading || !settings?.logoUrl) return
        const link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
        if (link) link.href = settings.logoUrl
    }, [loading, settings?.logoUrl])

    useEffect(() => {
        if (settings?.storeName) document.title = settings.storeName
    }, [settings?.storeName])

    const handleLogout = async () => {
        await logout()
        navigate('/Login')
    }

    const closeMobile = () => setMobileOpen(false)

    return (
        <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 40 }}>
            <nav
                style={{ backgroundColor: 'var(--vsm-white)', borderBottom: '1px solid var(--vsm-gray)' }}
                className="flex justify-between items-center py-3 px-4 md:px-8"
            >
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {logoSrc && (
                        <img
                            src={logoSrc}
                            alt={settings?.storeName || 'Logo'}
                            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                        />
                    )}
                    {!loading && (
                        <div>
                            {settings?.storeName ? (
                                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111', display: 'block', lineHeight: 1.2 }}>
                                    {settings.storeName}
                                </span>
                            ) : (
                                <>
                                    {/* <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111', display: 'block', lineHeight: 1.1 }}>
                                        Velas
                                    </span>
                                    <span style={{ fontWeight: 600, fontSize: '0.6rem', color: 'var(--vsm-brand)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                        Santa Marta
                                    </span> */}
                                </>
                            )}
                        </div>
                    )}
                </NavLink>

                {/* Center links */}
                <ul className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === '/'}
                                style={({ isActive }) => ({
                                    color: '#111',
                                    fontWeight: isActive ? 700 : 600,
                                    fontSize: '13px',
                                    textDecoration: isActive ? 'underline' : 'none',
                                    textUnderlineOffset: '5px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                })}
                                className="hover:opacity-60 transition-opacity"
                            >
                                {link.text}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right: cambia según auth */}
                <div className="flex items-center gap-4">
                    {/* Icono carrito */}
                    <NavLink to="/carrito" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#111', textDecoration: 'none' }} className="hover:opacity-60 transition-opacity">
                        <span style={{ fontSize: '1.25rem' }}>🛒</span>
                        {totalItems > 0 && (
                            <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: 'var(--vsm-brand)', color: '#fff', fontSize: '10px', fontWeight: 800, borderRadius: '999px', minWidth: '17px', height: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>
                                {totalItems}
                            </span>
                        )}
                    </NavLink>
                    {user ? (
                        // Usuario autenticado
                        <>
                            <NavLink
                                to="/Admin"
                                style={{ color: '#111', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                className="hover:opacity-60 transition-opacity"
                            >
                                Admin
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                style={{
                                    backgroundColor: 'var(--vsm-black)',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '8px 16px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                                className="hover:opacity-80 transition-opacity"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        // Usuario no autenticado
                        <>
                            <NavLink
                                to="/Login"
                                style={{ color: '#111', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                className="hover:opacity-60 transition-opacity"
                            >
                                Ingresar
                            </NavLink>
                            {/* <NavLink
                                to="/Register"
                                style={{
                                    backgroundColor: 'var(--vsm-brand)',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '8px 16px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    borderRadius: '4px',
                                }}
                                className="hover:opacity-90 transition-opacity"
                            >
                                Registro
                            </NavLink> */}
                        </>
                    )}

                    {/* Hamburger — solo móvil */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center gap-[5px] p-1"
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <span style={{
                            display: 'block', width: '22px', height: '2px',
                            backgroundColor: '#111',
                            transition: 'transform 0.2s, opacity 0.2s',
                            transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                        }} />
                        <span style={{
                            display: 'block', width: '22px', height: '2px',
                            backgroundColor: '#111',
                            transition: 'opacity 0.2s',
                            opacity: mobileOpen ? 0 : 1,
                        }} />
                        <span style={{
                            display: 'block', width: '22px', height: '2px',
                            backgroundColor: '#111',
                            transition: 'transform 0.2s, opacity 0.2s',
                            transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                        }} />
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    {/* Overlay para cerrar al tocar fuera */}
                    <div
                        onClick={closeMobile}
                        style={{ position: 'fixed', inset: 0, zIndex: 30 }}
                    />
                    <div
                        className="md:hidden"
                        style={{
                            backgroundColor: 'var(--vsm-white)',
                            borderBottom: '1px solid var(--vsm-gray)',
                            position: 'relative',
                            zIndex: 35,
                            padding: '8px 0 16px',
                        }}
                    >
                        <ul style={{ listStyle: 'none', margin: 0, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <NavLink
                                        to={link.to}
                                        end={link.to === '/'}
                                        onClick={closeMobile}
                                        style={({ isActive }) => ({
                                            display: 'block',
                                            padding: '12px 0',
                                            color: isActive ? 'var(--vsm-brand)' : '#111',
                                            fontWeight: isActive ? 700 : 600,
                                            fontSize: '13px',
                                            textDecoration: 'none',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            borderBottom: '1px solid var(--vsm-gray)',
                                        })}
                                    >
                                        {link.text}
                                    </NavLink>
                                </li>
                            ))}
                            {user && (
                                <li>
                                    <NavLink
                                        to="/Admin"
                                        onClick={closeMobile}
                                        style={{ display: 'block', padding: '12px 0', color: '#111', fontWeight: 600, fontSize: '13px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    >
                                        Admin
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </header>
    )
}

export default Menu
