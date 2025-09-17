import Button from "../../../IU/bottons/Botton";


const Logout = ()=>{
    const logout = () => {
        
        alert('Saliendo...');
      };


    return(
    <>
        <form onClick={logout}>
            <label>Salir</label>
            <Button>Salir</Button>
        </form>
    </>
    )

}

export default Logout