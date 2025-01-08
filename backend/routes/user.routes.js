import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  acceptFriendRequest,
  acceptMatchRequest,
  getRequests,
  getSuggestedUsers,
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
router.put("/update", protectRoute, updateUserProfile);


  
  

router.post("/match/:id", protectRoute, sendMatchRequest);
router.put("/match/:id/accept", protectRoute, acceptMatchRequest);

router.post("/details", protectRoute, seeDetails);


router.get("/suggested", protectRoute, getSuggestedUsers);

router.get("/requests", protectRoute, getRequests);


export default router;
