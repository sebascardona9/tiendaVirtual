import { NavLink} from "react-router-dom"


interface typeRoute {
    to: string
    text: string
}

const styleActive = "underline"

const Menu =()=> {
    return (
        <nav className="flex justify-between items-center fixed z-40 top-0 w-full py-5 px-8 text-lg font-light bg-white shadow-md">
        {/*Rutas en la parte derecha */}
            <ul className="flex items-center gap-6">
                {leftRoutes.map((route) => (
                    <li key={route.to} className="font-semibold text-xl">
                        <NavLink 
                            to={route.to} 
                            className={({ isActive }) => (isActive ? styleActive : undefined)}
                            
                        >
                        {route.text}
                        </NavLink>
                    </li>   
                ))}

            </ul>
        {/*Rutas en la parte izquierda */}
            <ul className="flex items-center gap-6">
                {rightRoutes.map((route) => (
                    <li key={route.to} className="font-semibold text-xl">
                        <NavLink 
                            to={route.to} 
                            className={({ isActive }) => (isActive ? styleActive : undefined)}
                            
                        >
                        {route.text}
                        </NavLink>
                    </li>   
                ))}
            </ul>
    


        </nav>

    )
}

/**
 * Adicionamos todas las rutas a un array, para que se vean en el menu
 */
const leftRoutes: typeRoute[] = [
    { to: "/", text: "Juguetes" },
]

const rightRoutes: typeRoute[] = [
    { to: "/Login", text: "Login" },
    { to: "/Register", text: "Register" },
]

export default Menu