import { Outlet } from "react-router-dom"
import CardJuguete from "../../../IU/cards/juguete"

/**
 * Lo que hace el Outlet es que nos permite navegar entre rutas
 * insertar una ruta dentro de otra ruta, esto es lo que permite que la pagina home
 * al darle click a algun enlace nos muestre la pagina del juguete aun viendo todos los juguetes
 * 
 */

const HomePage = () => {
    

    return (
    <>
        <h1>Bienvenid@, acá veras todos nuestros juguetes</h1>

        <Outlet/>
        <ul>        
            <CardJuguete/>
        </ul>
    </>
    )

    
}

export default HomePage
