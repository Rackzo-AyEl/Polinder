import React, { useEffect, useState } from "react";
import axios from "axios";

const Requests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/requests", {
          withCredentials: true,
        });
        setFriendRequests(response.data.friendRequests);
        setMatchRequests(response.data.matchRequests);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        setError("No se pudieron cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptFriendRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/friend/${id}/accept`, {}, {
        withCredentials: true,
      });
      setFriendRequests(friendRequests.filter((req) => req._id !== id));
      alert("Solicitud de amistad aceptada");
    } catch (error) {
      console.error("Error al aceptar solicitud de amistad:", error);
      alert("Error al aceptar solicitud de amistad");
    }
  };

  const handleAcceptMatchRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/match/${id}/accept`, {}, {
        withCredentials: true,
      });
      setMatchRequests(matchRequests.filter((req) => req._id !== id));
      alert("Solicitud de match aceptada");
    } catch (error) {
      console.error("Error al aceptar solicitud de match:", error);
      alert("Error al aceptar solicitud de match");
    }
  };

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Solicitudes Recibidas</h1>

      {/* Solicitudes de amistad */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Solicitudes de Amistad</h2>
        {friendRequests.length > 0 ? (
          <ul className="space-y-4">
            {friendRequests.map((request) => (
              <li
                key={request._id}
                className="flex items-center justify-between space-x-4 p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={request.profileImage || `https://source.unsplash.com/random/50x50?person`}
                    alt={request.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-700 dark:text-white">{request.fullname}</p>
                    <p className="text-sm text-gray-500">@{request.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptFriendRequest(request._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Aceptar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tienes solicitudes de amistad.</p>
        )}
      </div>

      {/* Solicitudes de match */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-red-500">Solicitudes de Match</h2>
        {matchRequests.length > 0 ? (
          <ul className="space-y-4">
            {matchRequests.map((request) => (
              <li
                key={request._id}
                className="flex items-center justify-between space-x-4 p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={request.profileImage || `https://source.unsplash.com/random/50x50?person`}
                    alt={request.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-700 dark:text-white">{request.fullname}</p>
                    <p className="text-sm text-gray-500">@{request.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptMatchRequest(request._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Aceptar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tienes solicitudes de match.</p>
        )}
      </div>
    </div>
  );
};

export default Requests;
