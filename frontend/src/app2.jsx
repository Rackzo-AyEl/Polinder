import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import AuthScreen from "./auth/AuthScreen"; // Importa el nuevo componente combinado
import MainPage from "./MainPage";

const App2 = () => {
  const { user } = useContext(UserContext);

  // Si no hay usuario logueado, muestra AuthScreen
  if (!user) {
    return <AuthScreen />;
  }

  // Si el usuario está logueado, muestra MainPage
  return <MainPage />;
};

export default App2;
