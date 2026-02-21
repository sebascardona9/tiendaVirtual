import { useState, createContext, useEffect, useContext, useRef } from "react"
import type { ReactNode } from 'react'
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { auth } from "../../firebase/firebase.config"

// ─── Constantes ────────────────────────────────────────────────────────────
const INACTIVITY_MS = 5 * 60 * 1000   // 5 minutos

const ACTIVITY_EVENTS = [
    'mousemove', 'mousedown', 'keydown',
    'scroll',    'touchstart', 'click',
] as const

// ─── Tipos ─────────────────────────────────────────────────────────────────
interface AuthContextType {
    user:    User | null
    loading: boolean
    logout:  () => Promise<void>
}

// ─── Contexto ──────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
    user:    null,
    loading: true,
    logout:  async () => {},
})

// ─── Provider ──────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user,    setUser]    = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    /** Cierra la sesión en Firebase (limpia IndexedDB) y cancela el timer */
    const logout = async () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        await signOut(auth)
    }

    // Suscripción al estado de autenticación de Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Timer de inactividad — solo activo mientras hay sesión
    useEffect(() => {
        if (!user) {
            // Si no hay usuario, cancelar cualquier timer pendiente
            if (timerRef.current) clearTimeout(timerRef.current)
            return
        }

        /** Reinicia la cuenta regresiva cada vez que detecta actividad */
        const reset = () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => signOut(auth), INACTIVITY_MS)
        }

        ACTIVITY_EVENTS.forEach(ev =>
            window.addEventListener(ev, reset, { passive: true })
        )
        reset()  // arranca el timer al hacer login

        return () => {
            ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, reset))
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [user])

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext)
