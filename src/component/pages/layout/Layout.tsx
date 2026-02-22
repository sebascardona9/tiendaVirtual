import { useLocation } from "react-router-dom"

interface LayoutProps {
    children: React.ReactNode
    alignRight?: boolean
}

const NAV_HEIGHT = '96px'

const Layout = ({ children, alignRight }: LayoutProps) => {
    const location = useLocation()
    const isHome = location.pathname === '/'

    return (
        <div
            style={{ marginTop: NAV_HEIGHT }}
            className={`flex flex-col ${
                isHome ? '' : alignRight ? 'items-end px-4' : 'items-center px-4'
            } w-full`}
        >
            {children}
        </div>
    )
}

export default Layout
