import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Usar GET para obtener información del perfil del usuario autenticado
router.get("/me", protectRoute, getMe);

// Mantener POST para crear o enviar datos
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
