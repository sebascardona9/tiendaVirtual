import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/authContext"

const AdminPanel = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/Login')
    }

    return (
        <div
            style={{ minHeight: 'calc(100vh - 96px)', padding: '3rem 2rem' }}
            className="max-w-5xl mx-auto w-full"
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '2rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid var(--vsm-gray)',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <div>
                    <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--vsm-black)' }}>
                        Panel de Administración
                    </h1>
                    <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', marginTop: '4px' }}>
                        Sesión activa:{' '}
                        <strong style={{ color: 'var(--vsm-black)' }}>{user?.email}</strong>
                    </p>
                    <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '11px', marginTop: '4px' }}>
                        La sesión se cierra automáticamente tras 5 minutos de inactividad.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: 'var(--vsm-black)',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                    }}
                    className="hover:opacity-80 transition-opacity"
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Contenido del panel */}
            <div
                style={{
                    backgroundColor: 'var(--vsm-white)',
                    borderRadius: '8px',
                    padding: '2rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                }}
            >
                <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px' }}>
                    Bienvenido al panel de administración de <strong style={{ color: 'var(--vsm-black)' }}>Velas Santa Marta</strong>.
                    Aquí podrás gestionar productos, pedidos y configuración de la tienda.
                </p>
            </div>
        </div>
    )
}

export default AdminPanel
