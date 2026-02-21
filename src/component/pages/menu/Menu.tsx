import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/authContext"
import { useSettings } from '../../../hooks/useSettings'
import logoImg from '../../../assets/Images/Logo.jpeg'

const navLinks = [
    { to: '/',         text: 'Inicio'      },
    { to: '/juguetes', text: '+ Productos' },
    { to: '/#nosotros',text: 'Nosotros'   },
    { to: '/contacto', text: 'Contacto'   },
]

const Menu = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { settings } = useSettings()
    const logoSrc = settings?.logoUrl || logoImg

    const handleLogout = async () => {
        await logout()
        navigate('/Login')
    }

    return (
        <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 40 }}>

            {/* Announcement bar */}
            {/* <div
                style={{
                    backgroundColor: '#111',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '7px 1rem',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    fontWeight: 500,
                }}
            >
                El costo del envío se paga al momento de la entrega
            </div> */}

            {/* Main nav */}
            <nav
                style={{ backgroundColor: 'var(--vsm-white)', borderBottom: '1px solid var(--vsm-gray)' }}
                className="flex justify-between items-center py-3 px-8"
            >
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img
                        src={logoSrc}
                        alt="Velas Santa Marta"
                        style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                    />
                    <div>
                        {settings?.storeName ? (
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111', display: 'block', lineHeight: 1.2 }}>
                                {settings.storeName}
                            </span>
                        ) : (
                            <>
                                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111', display: 'block', lineHeight: 1.1 }}>
                                    Velas
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.6rem', color: 'var(--vsm-brand)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                    Santa Marta
                                </span>
                            </>
                        )}
                    </div>
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
                            <NavLink
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
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Menu
