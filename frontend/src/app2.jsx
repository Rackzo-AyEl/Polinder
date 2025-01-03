import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import Login from "./auth/loginScreen";
import MainPage from "./MainPage";


const App2 = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Login />;
  }

  return <MainPage />;
};

export default App2;
