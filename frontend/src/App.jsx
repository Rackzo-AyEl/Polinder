import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  UserPlus,
  Settings,
  LogOut,
  Flame,
  X,
  Menu,
  MessageCircle,
  Moon,
  Sun,
} from "lucide-react";

const App = () => {
  const [activeTab, setActiveTab] = useState("cards");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
 
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    age: 28,
    occupation: "Software Developer",
    interests: ["Wine tasting", "Hiking", "Photography"],
    lookingFor: "A serious relationship",
    bio: "Wine enthusiast with a passion for outdoor adventures. Looking for someone to share life's moments with.",
  });

  // Manejo del modo oscuro en el elemento HTML
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUserProfile({
      name: formData.get("name"),
      age: parseInt(formData.get("age")),
      occupation: formData.get("occupation"),
      interests: formData
        .get("interests")
        .split(",")
        .map((item) => item.trim()),
      lookingFor: formData.get("lookingFor"),
      bio: formData.get("bio"),
    });
    setIsSettingsOpen(false);
  };

  // Componente Button simplificado
  const Button = ({ children, onClick, className }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full ${className}`}>
      {children}
    </button>
  );

  // Componente Card simplificado usando dark: para el modo oscuro
  const Card = ({ children, className }) => (
    <div
      className={`rounded-xl shadow-lg bg-red-300 text-red-800 dark:bg-gray-800 dark:text-white ${className}`}
    >
      {children}
    </div>
  );

  const Avatar = ({ src, alt }) => (
    <img src={src} alt={alt} className="w-10 h-10 rounded-full object-cover" />
  );

  //
  return (
    <div
      className={`flex flex-col md:flex-row h-screen bg-red-50 text-red-800 dark:bg-gray-900 dark:text-white`}
    >
      {/* Mobile top bar */}
      <div className="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-red-800 dark:text-red-400">
          Polinder
        </h1>
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
          Profile
        </h2>
        <nav className="space-y-2">
          <Button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full justify-start text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <Settings className="mr-2" />
            Settings
          </Button>
          <Button
            onClick={() => {}}
            className="w-full justify-start text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <LogOut className="mr-2" />
            Logout
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
        <div className="mb-4">
          <Button
            onClick={() => setActiveTab("cards")}
            className={`mr-4 ${
              activeTab === "cards"
                ? "bg-red-700 text-white"
                : "bg-white text-red-700"
            } rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-700`}
          >
            {" "}
            <Flame className="mr-2 items-center" /> Discover{" "}
          </Button>{" "}
          <Button
            onClick={() => setActiveTab("feed")}
            className={`${
              activeTab === "feed"
                ? "bg-red-700 text-white"
                : "bg-white text-red-700"
            } rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-700`}
          >
            {" "}
            <Heart className="mr-2" /> Feed{" "}
          </Button>
        </div>

        {activeTab === "cards" && (
          <Card className="w-full max-w-sm mx-auto overflow-hidden">
            <img
              src="https://source.unsplash.com/random/400x300?wine"
              alt="Profile"
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                {userProfile.name}, {userProfile.age}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {userProfile.occupation}
              </p>
              <div className="flex justify-between">
                <Button className="bg-red-50 text-red-700 dark:bg-gray-700 dark:text-red-400">
                  <X />
                </Button>
                <Button className="bg-red-50 text-red-700 dark:bg-gray-700 dark:text-red-400">
                  <Heart />
                </Button>
                <Button className="bg-red-50 text-red-700 dark:bg-gray-700 dark:text-red-400">
                  <UserPlus />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "feed" && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((post) => (
              <Card key={post} className="p-4">
                <div className="flex items-center mb-4">
                  <Avatar
                    src={`https://source.unsplash.com/random/100x100?face${post}`}
                    alt="User"
                  />
                  <div className="ml-2">
                    <p className="font-semibold text-red-800 dark:text-red-400">
                      User Name
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <p className="mb-4">
                  Just tried an amazing Cabernet Sauvignon from Napa Valley. The
                  bouquet was exquisite!
                </p>
                <img
                  src={`https://source.unsplash.com/random/400x300?wine${post}`}
                  alt="Wine Post"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center space-x-2">
                  <Button className="text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
                    <Heart className="mr-2" />
                    Like
                  </Button>
                  <Button className="text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
                    <UserPlus className="mr-2" />
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right sidebar - Online friends */}
      <div className="hidden md:block w-64 bg-red-50 text-red-800 dark:bg-gray-800 dark:text-white p-4 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-400">
          Online Friends
        </h2>
        <ul className="space-y-2">
          {[1, 2, 3, 4, 5].map((friend) => (
            <li key={friend} className="flex items-center space-x-2">
              <Avatar
                src={`https://source.unsplash.com/random/100x100?person${friend}`}
                alt={`Friend ${friend}`}
              />
              <span className="font-semibold text-red-800 dark:text-red-400">
                Friend {friend}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
