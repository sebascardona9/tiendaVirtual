import { Link } from "react-router-dom";
import Button from "../../../IU/bottons/Botton";
import React from "react";
const Login = () => {
  const [userMail, setUserMail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");

  const FuntionLogin = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log(userMail);
    alert(userMail+userPassword);
    
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Iniciar Sesión</h2>

        <form 
          className="space-y-4"
          onSubmit={FuntionLogin}
          >

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="tu@correo.com"
              value={userMail}
              onChange={(e) => setUserMail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Ingresar
          </button> */}
          <Button 
            type="submit"
            
          >Ingresar
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/Register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
        
      </div>


     
    </div>

  );
};

export default Login;