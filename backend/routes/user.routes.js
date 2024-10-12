import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserFriends, getUserProfile, sendFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();
router.get("/profile/:username", protectRoute, getUserProfile);
//router.get("/suggested", protectRoute, getSuggestedUsers);
//router.post("/friend/:id", protectRoute, getUserFriends);
router.post("/friend/:id", protectRoute, sendFriendRequest);
//router.post("/update", protectRoute, updateUserProfile);

export default router;