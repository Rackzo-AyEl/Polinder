import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import TestConnection from './aa.jsx'
import Login from './auth/loginScreen.jsx'
import Signup from './auth/signupScreen.jsx'
import { UserProvider } from "./UserContext"; // Proveedor del contexto de usuario
import App2 from './app2.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> {/* Proveer el contexto del usuario a toda la aplicación */}
      <App2 />
    </UserProvider>

  </StrictMode>,
)
