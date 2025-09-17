import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../IU/bottons/Botton"; 

const Register = () => {
  const [userName, setUserName] = useState("");
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const FunctionRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedo agregar la lógica para enviar los datos al backend
    alert("Por ahora muestra los datos ingresados en este Alert: " + userName +
         ' - '+ userMail +
         ' - ' + userPassword );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Registrarse</h2>

        <form className="space-y-4" onSubmit={FunctionRegister}>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
              placeholder="••••••••"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button type="submit">Crear cuenta</Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/Login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
