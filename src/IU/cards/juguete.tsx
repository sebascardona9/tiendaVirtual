import { Link } from "react-router-dom"
import juguetesData from "../../component/pages/juguetes/JuguetesData"//tremos los juguetes del arreglo




const CardJuguete = () => {
    return (        
        <>  
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {juguetesData.map((juguete) => (

                    <Link
                        key={juguete.slug
                        }
                        to={`/juguetes/${juguete.slug}`
                        }
                        className="bg-white cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        style={{ margin: '10px' }}
                    >
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Título: {juguete.title}</h2>
                            <p>Descripción: {juguete.content}</p>
                            <p>Precio: ${juguete.precio}</p>
                         
                        </div>
                    
                    </Link>

                ))}      
            </div>
        
        </>

    )
}
export default CardJuguete