import { Navigate } from 'react-router-dom'
import { useAuth } from './authContext'

const ProtecterRouter = ({ children }: React.PropsWithChildren) => {
    const { user, loading } = useAuth()
    if (loading) return <p>cargando...</p>
    if (!user)   return <Navigate to="/Login" />

    return <>{children}</>
}

export default ProtecterRouter




