import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("bio", bio);
    if (profileImage) formData.append("profileImage", profileImage);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(response.data);
      setMessage("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setMessage("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-red-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">Ajustes</h2>
      {message && <p className="text-sm mb-4 text-center text-red-600">{message}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre Completo:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Biografía:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagen de Perfil:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setProfileImage, setProfilePreview)}
          />
          {profilePreview && (
            <img
              src={profilePreview}
              alt="Vista previa de perfil"
              className="w-24 h-24 rounded-full mt-2"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagen de Portada:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setCoverImage, setCoverPreview)}
          />
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Vista previa de portada"
              className="w-full h-32 object-cover mt-2 rounded-lg"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
