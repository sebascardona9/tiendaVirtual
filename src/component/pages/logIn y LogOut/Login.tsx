import { Link, useNavigate } from "react-router-dom"
import React from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../firebase/firebase.config"

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--vsm-gray)',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    color: 'var(--vsm-black)',
    backgroundColor: 'var(--vsm-white)',
    transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--vsm-black)',
    display: 'block',
    marginBottom: '6px',
}

const Login = () => {
    const [userMail, setUserMail]       = React.useState("")
    const [userPassword, setUserPassword] = React.useState("")
    const [errorMsg, setErrorMsg]       = React.useState<string | null>(null)
    const [loading, setLoading]         = React.useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, userMail, userPassword)
            setErrorMsg(null)
            navigate("/Admin")
        } catch {
            setErrorMsg("Correo o contraseña incorrectos. Por favor verifica tus datos.")
            setUserPassword("")
        } finally {
            setLoading(false)
        }
    }

    return (
        /* Ocupa el viewport restante tras el nav (96 px) y centra el card */
        <div
            style={{ minHeight: 'calc(100vh - 96px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            className="w-full"
        >
            <div
                style={{
                    backgroundColor: 'var(--vsm-white)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '420px',
                }}
            >
                {/* Heading */}
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '0.4rem' }}>
                    Acceder
                </h2>
                <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', marginBottom: '2rem' }}>
                    ¿No tienes cuenta?{' '}
                    <Link
                        to="/Register"
                        style={{ color: 'var(--vsm-brand)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    >
                        Regístrate aquí
                    </Link>
                </p>

                <form onSubmit={handleLogin} noValidate>
                    {/* Email */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="email" style={labelStyle}>
                            Nombre de usuario o correo electrónico{' '}
                            <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={userMail}
                            onChange={(e) => setUserMail(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--vsm-brand)')}
                            onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--vsm-gray)')}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Contraseña */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="password" style={labelStyle}>
                            Contraseña <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--vsm-brand)')}
                            onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--vsm-gray)')}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Recuérdame */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <input
                            type="checkbox"
                            id="remember"
                            style={{ width: '15px', height: '15px', accentColor: 'var(--vsm-brand)', cursor: 'pointer' }}
                        />
                        <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', cursor: 'pointer' }}>
                            Recuérdame
                        </label>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                        <div
                            style={{
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '5px',
                                padding: '10px 14px',
                                marginBottom: '1rem',
                            }}
                        >
                            <p style={{ color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>{errorMsg}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--vsm-brand)',
                            color: '#fff',
                            padding: '12px',
                            borderRadius: '5px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.07em',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.75 : 1,
                            transition: 'opacity 0.2s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {loading ? 'Verificando...' : 'Acceso'}
                    </button>

                    {/* Olvidaste contraseña */}
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a
                            href="#"
                            style={{
                                color: 'var(--vsm-gray-mid)',
                                fontSize: '12px',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px',
                            }}
                            onClick={(e) => e.preventDefault()}
                        >
                            ¿Olvidaste la contraseña?
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
