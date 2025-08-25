/**
 * el useNavigate nos permite navegar entre rutas, el -1 nos indica que vamos a la ruta anterior
 * que se navego pero tambien podemos navegar a una ruta especifica
 * por ejemplo podemos decri que navigate('/')
 */

import { useNavigate } from "react-router-dom"
import Button from "./Botton";

    
    const Botton_Back = () => {
        const navigate = useNavigate();
            
        function returnToBack() {
            //navigate('/');
            navigate(-2);//el numero indica la cantidad de paginas que quiero devolverme
            
        }

        return (
            <Button 
            onClick={returnToBack}>
                Regresar
            </Button>
        )
    }

export default Botton_Back