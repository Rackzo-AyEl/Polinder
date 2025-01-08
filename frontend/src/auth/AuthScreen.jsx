import React, { useState } from "react";
import axios from "axios";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true); // Controla si está en Login o Signup
  const [message, setMessage] = useState("");

  // Estados para Login
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Estados para Signup
  const [signupData, setSignupData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData,
        { withCredentials: true }
      );

      setMessage("Inicio de sesión exitoso");
      console.log("Usuario logueado:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data);
      setMessage(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        signupData,
        { withCredentials: true }
      );

      setMessage("Registro exitoso");
      console.log("Usuario registrado:", response.data);
    } catch (error) {
      console.error("Error al registrarse:", error.response?.data);
      setMessage(error.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-800 dark:bg-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {isLogin ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Iniciar Sesión
              </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
            <p className="mt-6 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-red-500 hover:underline"
              >
                Crear cuenta
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Registro</h1>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre completo:</label>
                <input
                  type="text"
                  name="fullname"
                  value={signupData.fullname}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Correo electrónico:</label>
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Registrarse
              </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
            <p className="mt-6 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-red-500 hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
