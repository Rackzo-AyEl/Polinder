import React, { useState, useEffect, useContext } from "react";
import {
  Flame,
  UserPlus,
  X,
  Heart,
} from "lucide-react";
import axios from "axios";
import { UserContext } from "./UserContext";

const Discover = () => {
  const { user } = useContext(UserContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/suggested", {
          withCredentials: true,
        });
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error("Error al cargar usuarios sugeridos:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleSendFriendRequest = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/friend/${id}`, {}, { withCredentials: true });
      setSuggestedUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error al enviar solicitud de amistad:", error);
    }
  };

  const handleSendMatchRequest = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/match/${id}`, {}, { withCredentials: true });
      setSuggestedUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error al enviar solicitud de match:", error);
    }
  };

  const handleIgnoreUser = (id) => {
    setSuggestedUsers((prev) => prev.filter((user) => user._id !== id));
  };

  return (
    <div className="space-y-4">
      {suggestedUsers.length > 0 ? (
        suggestedUsers.map((suggestedUser) => (
          <div key={suggestedUser._id} className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={suggestedUser.profileImage || "https://source.unsplash.com/random/100x100?person"}
                  alt={suggestedUser.fullname}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-2">
                  <p className="font-semibold">{suggestedUser.fullname}</p>
                  <p className="text-sm text-gray-500">@{suggestedUser.username}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSendFriendRequest(suggestedUser._id)}
                  className="bg-green-500 text-white p-2 rounded-full"
                >
                  <UserPlus />
                </button>
                <button
                  onClick={() => handleSendMatchRequest(suggestedUser._id)}
                  className="bg-blue-500 text-white p-2 rounded-full"
                >
                  <Heart />
                </button>
                <button
                  onClick={() => handleIgnoreUser(suggestedUser._id)}
                  className="bg-red-500 text-white p-2 rounded-full"
                >
                  <X />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay usuarios sugeridos en este momento.</p>
      )}
    </div>
  );
};

export default Discover;
