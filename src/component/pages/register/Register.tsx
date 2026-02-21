import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
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

const Register = () => {
    const [userName, setUserName]         = React.useState("")
    const [userMail, setUserMail]         = React.useState("")
    const [userPassword, setUserPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [errorMsg, setErrorMsg]         = React.useState<string | null>(null)
    const [loading, setLoading]           = React.useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (userPassword !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden.")
            return
        }
        if (userPassword.length < 6) {
            setErrorMsg("La contraseña debe tener al menos 6 caracteres.")
            return
        }

        setLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, userMail, userPassword)
            setErrorMsg(null)
            navigate("/Login")
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setErrorMsg("Este correo ya está registrado. Intenta iniciar sesión.")
            } else {
                setErrorMsg("Error al crear la cuenta. Por favor intenta de nuevo.")
            }
            setUserPassword("")
            setConfirmPassword("")
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
                    borderRadius: '8px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '420px',
                }}
            >
                {/* Heading */}
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '0.4rem' }}>
                    Crear cuenta
                </h2>
                <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', marginBottom: '2rem' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link
                        to="/Login"
                        style={{ color: 'var(--vsm-brand)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    >
                        Inicia sesión aquí
                    </Link>
                </p>

                <form onSubmit={handleRegister} noValidate>
                    {/* Nombre */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="name" style={labelStyle}>
                            Nombre completo <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--vsm-brand)')}
                            onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--vsm-gray)')}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="email" style={labelStyle}>
                            Correo electrónico <span style={{ color: '#DC2626' }}>*</span>
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
                        <p style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', marginTop: '5px' }}>
                            Mínimo 6 caracteres.
                        </p>
                    </div>

                    {/* Confirmar contraseña */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirmPassword" style={labelStyle}>
                            Confirmar contraseña <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--vsm-brand)')}
                            onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--vsm-gray)')}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Política de privacidad */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '1.5rem' }}>
                        <input
                            type="checkbox"
                            id="privacy"
                            required
                            style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: 'var(--vsm-brand)', cursor: 'pointer', flexShrink: 0 }}
                        />
                        <label htmlFor="privacy" style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', cursor: 'pointer', lineHeight: 1.6 }}>
                            He leído y acepto la{' '}
                            <a href="#" style={{ color: 'var(--vsm-brand)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                Política de privacidad
                            </a>
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
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
