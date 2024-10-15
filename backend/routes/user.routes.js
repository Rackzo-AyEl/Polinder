import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { acceptFriendRequest, getUserFriends, getUserProfile, sendFriendRequest, sendMatchRequest, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();
router.get("/profile/:username", protectRoute, getUserProfile);
//router.get("/suggested", protectRoute, getSuggestedUsers);
//router.post("/friend/:id", protectRoute, getUserFriends);
router.post("/friend/:id", protectRoute, sendFriendRequest);
router.put("/friend/:id/accept", protectRoute, acceptFriendRequest);

router.post("/update", protectRoute, updateUserProfile);

router.post("/match/:id", protectRoute, sendMatchRequest);

export default router;