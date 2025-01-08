import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const Settings = ({ onBack }) => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (password && password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        { username, email, bio, password: password || undefined },
        { withCredentials: true }
      );
      setUser(response.data);
      setMessage("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setMessage(
        error.response?.data?.error || "Error al actualizar el perfil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-red-50 dark:bg-gray-800 p-6 rounded-lg shadow-md sm:mt-8 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-red-600 dark:text-red-400 text-center">
        Ajustes de Perfil
      </h2>
      {message && (
        <p className="text-sm mb-4 text-center text-red-600 bg-red-100 p-2 rounded-md">
          {message}
        </p>
      )}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Biografía:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nueva Contraseña (opcional):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </form>
      <button
        onClick={onBack}
        className="w-full mt-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
      >
        Regresar a Discover
      </button>
    </div>
  );
};

export default Settings;
