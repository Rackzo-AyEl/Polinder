import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, getPostsByUser } from '../controllers/post.controller.js';

const router = express.Router();

router.post("/create", protectRoute, createPost);
//router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

router.get("/", protectRoute, getPostsByUser); // Nueva ruta para obtener los posts


export default router;