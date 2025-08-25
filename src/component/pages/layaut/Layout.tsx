import { useLocation } from "react-router-dom"
import Botton_Back from "../../../IU/bottons/Botton_Back"
interface LayoutProps {
    children: React.ReactNode
    alignRight?: boolean
}



const Layout = ({children, alignRight}: LayoutProps) => {
    const location = useLocation()
    const showBackButton = location.pathname === '/Login'
    return (
        <div className={`flex flex-col ${
            alignRight ? 'items-end' : 'items-center'} mt-24 w-full px-4`}>
            {/* Botón atrás solo para /Login */}
            {showBackButton && (
                <div className="self-start mb-4">
                    <Botton_Back />
                </div>
            )}
            {children}

            
        </div>
    )
}

export default Layout