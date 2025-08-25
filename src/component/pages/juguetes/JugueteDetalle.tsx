/**
 * usamos el useParams para obtener el slug del juguete
 */


import { useParams } from "react-router-dom"
import juguetesData from "./JuguetesData"
const Juguetedetalle = () => {
    const {slug} = useParams()

    const articulo = juguetesData.find((juguete) => juguete.slug === slug)
    if (!articulo) {
        return <div>Articulo no encontrado</div>
    }
    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg cursor-pointer">
            <h1 className="text-3xl font-bold mb-4">{articulo.title}</h1>
            <p className="text-gray-600">{articulo.content}</p>
            <p className="text-gray-600">Precio: ${articulo.precio}</p>
    
        </div>
    )

}

export default Juguetedetalle