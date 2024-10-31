import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary'

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Please provide text or image" });
    }

    if(img){
      const uploadedResponse = await cloudinary.uploader.upload(img)
      img = uploadedResponse.secure_url
    }

    const newPost = new Post({
      user: userId,
      text,
      img, 
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error en el controlador de createPost:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(user._id)) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: user._id } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      await Post.findByIdAndUpdate(id, { $push: { likes: user._id } });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error en el controlador de likeUnlikePost:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = new Comment({
      text: req.body.text,
      user: user._id,
    });

    await newComment.save();

    await Post.findByIdAndUpdate(id, { $push: { comments: newComment } });
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("Error en el controlador de commentOnPost:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({ error: "Post not found" });
    }

    if(post.user.toString() !== req.user._id.toString()){
      return res.status(401).json({error: "You arent authorized to delete this post"});
    }

    if(post.img){
      const imgId = post.img.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(imgId)
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error en el controlador de deletePost:", error.message);
    res.status(500).json({ error: error.message });
  }
};