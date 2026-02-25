import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../../../firebase/firebase.config"
import { inputStyle, labelStyle, errorBox, errorText, primaryBtn, onFocusBrand, onBlurGray } from "../../../styles/formStyles"

const Register = () => {
    const [userName, setUserName]               = React.useState("")
    const [userMail, setUserMail]               = React.useState("")
    const [userPassword, setUserPassword]       = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [errorMsg, setErrorMsg]               = React.useState<string | null>(null)
    const [loading, setLoading]                 = React.useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (userName.trim().length === 0) {
            setErrorMsg("Ingresa tu nombre completo.")
            return
        }
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
            const cred = await createUserWithEmailAndPassword(auth, userMail, userPassword)
            await updateProfile(cred.user, { displayName: userName.trim() })
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
                    borderRadius: 'var(--vsm-radius)',
                    boxShadow: 'var(--vsm-shadow-card)',
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
                            Nombre completo <span style={{ color: 'var(--vsm-error)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onFocus={onFocusBrand}
                            onBlur={onBlurGray}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="email" style={labelStyle}>
                            Correo electrónico <span style={{ color: 'var(--vsm-error)' }}>*</span>
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
                        <p style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', marginTop: '5px' }}>
                            Mínimo 6 caracteres.
                        </p>
                    </div>

                    {/* Confirmar contraseña */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirmPassword" style={labelStyle}>
                            Confirmar contraseña <span style={{ color: 'var(--vsm-error)' }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={onFocusBrand}
                            onBlur={onBlurGray}
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
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
