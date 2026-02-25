import { Link, useNavigate } from "react-router-dom"
import React from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../firebase/firebase.config"
import { inputStyle, labelStyle, errorBox, errorText, primaryBtn, onFocusBrand, onBlurGray } from "../../../styles/formStyles"

const Login = () => {
    const [userMail, setUserMail]           = React.useState("")
    const [userPassword, setUserPassword]   = React.useState("")
    const [errorMsg, setErrorMsg]           = React.useState<string | null>(null)
    const [loading, setLoading]             = React.useState(false)
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
        <div
            style={{ minHeight: 'calc(100vh - 96px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            className="w-full"
        >
            <div
                style={{
                    backgroundColor: 'var(--vsm-white)',
                    borderRadius: 'var(--vsm-radius)',
                    boxShadow: 'var(--vsm-shadow-card)',
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
                            <span style={{ color: 'var(--vsm-error)' }}>*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={userMail}
                            onChange={(e) => setUserMail(e.target.value)}
                            onFocus={onFocusBrand}
                            onBlur={onBlurGray}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Contraseña */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="password" style={labelStyle}>
                            Contraseña <span style={{ color: 'var(--vsm-error)' }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            onFocus={onFocusBrand}
                            onBlur={onBlurGray}
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
                        <div style={{ ...errorBox, marginBottom: '1rem' }}>
                            <p style={errorText}>{errorMsg}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...primaryBtn,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.75 : 1,
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
