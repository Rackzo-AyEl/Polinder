import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  acceptFriendRequest,
  getUserFriends,
  getUserProfile,
  seeDetails,
  sendFriendRequest,
  sendMatchRequest,
  updateUserProfile,
} from "../controllers/user.controller.js";
import upload from "../multer.js"; // Importa Multer

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/friend/:id", protectRoute, sendFriendRequest);
router.put("/friend/:id/accept", protectRoute, acceptFriendRequest);

// Añade Multer para manejar imágenes
router.put(
    "/update",
    protectRoute, // Middleware de autenticación
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]), // Middleware de Multer para manejar archivos
    updateUserProfile // Controlador
);

  
  

router.post("/match/:id", protectRoute, sendMatchRequest);
router.post("/details", protectRoute, seeDetails);

export default router;
