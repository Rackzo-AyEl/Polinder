import React, { useState, useEffect, useContext } from "react";
import {
  Heart,
  Settings as SettingsIcon,
  LogOut,
  Flame,
  MessageCircle,
  Moon,
  Menu,
  Sun,
  UserPlus,
} from "lucide-react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Settings from "./Settings";
import Feed from "./Feed";
import Discover from "./Discover";
import Requests from "./Requests";

const Mainpage = () => {
  const { user, setUser } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        if (userResponse.data.friends.length > 0) {
          const friendsResponse = await axios.post(
            "http://localhost:5000/api/users/details",
            { ids: userResponse.data.friends },
            { withCredentials: true }
          );
          setFriends(friendsResponse.data);
        }
      } catch (error) {
        console.error("Error al cargar usuario y amigos:", error);
      }
    };

    fetchUserAndFriends();
  }, [setUser]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // Limpia el estado del usuario
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const Button = ({ children, onClick, className }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full ${className}`}>
      {children}
    </button>
  );

  const Avatar = ({ src, alt }) => (
    <img src={src} alt={alt} className="w-10 h-10 rounded-full object-cover" />
  );

  if (!user) {
    return <div>Cargando...</div>; // Redirigir al componente de login si user es null
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-red-50 text-red-800 dark:bg-gray-900 dark:text-white">
      {/* Mobile top bar */}
      <div className="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-red-800 dark:text-red-400">Polinder</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => {}} className="text-red-800 dark:text-red-400">
            <MessageCircle />
          </Button>
          <Button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-red-800 dark:text-red-400"
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSettingsOpen ? "block" : "hidden"
        } md:block w-64 bg-red-50 text-red-800 dark:bg-gray-800 dark:text-white p-4 flex-shrink-0`}
      >
        <h2 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-400">
          Perfil
        </h2>
        <div className="mb-4">
          <p className="font-semibold">{user.fullname}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
        <nav className="space-y-2">
          <Button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full justify-start text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <SettingsIcon className="mr-2" />
            Configuración
          </Button>
          <Button
            onClick={() => setActiveTab("requests")}
            className="w-full justify-start text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <UserPlus className="mr-2" />
            Solicitudes
          </Button>
          <Button
            onClick={handleLogout}
            className="w-full justify-start text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <LogOut className="mr-2" />
            Cerrar sesión
          </Button>
          <div className="flex items-center space-x-2 mt-4">
            <Sun className="text-red-700 dark:text-red-400" />
            <label className="relative inline-block w-10 h-6">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="sr-only"
              />
              <span className="block bg-gray-200 dark:bg-gray-600 w-10 h-6 rounded-full shadow-inner"></span>
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full transition transform ${
                  isDarkMode ? "translate-x-4 bg-yellow-500" : "bg-white"
                }`}
              ></span>
            </label>
            <Moon className="text-red-700 dark:text-red-400" />
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-hidden">
        {isSettingsOpen ? (
          <Settings
            onBack={() => {
              setIsSettingsOpen(false);
              setActiveTab("cards");
            }}
          />
        ) : (
          <div>
            <div className="mb-4">
              <Button
                onClick={() => setActiveTab("cards")}
                className={`mr-4 ${
                  activeTab === "cards"
                    ? "bg-red-700 text-white"
                    : "bg-white text-red-700"
                } rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-700`}
              >
                <Flame className="mr-2 items-center" /> Discover
              </Button>
              <Button
                onClick={() => setActiveTab("feed")}
                className={`${
                  activeTab === "feed"
                    ? "bg-red-700 text-white"
                    : "bg-white text-red-700"
                } rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-700`}
              >
                <Heart className="mr-2" /> Feed
              </Button>
            </div>
            {activeTab === "feed" && <Feed />}
            {activeTab === "cards" && <Discover />}
            {activeTab === "requests" && <Requests />}
          </div>
        )}
      </div>

      {/* Right sidebar - Online friends */}
      <div className="hidden md:block w-64 bg-red-50 text-red-800 dark:bg-gray-800 dark:text-white p-4 flex-shrink-0 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-400">
          Amigos en línea
        </h2>
        <ul className="space-y-2">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li key={friend._id} className="flex items-center space-x-2">
                <Avatar
                  src={
                    friend.profileImage ||
                    `https://source.unsplash.com/random/100x100?person`
                  }
                  alt={friend.fullname}
                />
                <span className="font-semibold text-red-800 dark:text-red-400">
                  {friend.fullname}
                </span>
              </li>
            ))
          ) : (
            <p>No hay amigos en línea.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Mainpage;
