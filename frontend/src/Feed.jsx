import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { Trash2 } from "lucide-react";

const Feed = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts", {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error al cargar los posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const newPost = { text: newPostText };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts/create",
        newPost,
        { withCredentials: true }
      );

      setNewPostText("");

      const createdPost = {
        ...response.data,
        user: {
          fullname: user.fullname,
          profileImage: user.profileImage,
          _id: user._id,
        },
      };

      setPosts((prevPosts) => [createdPost, ...prevPosts]);
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error al borrar el post:", error);
    }
  };

  return (
    <div className="space-y-4 h-full max-h-[600px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      <form onSubmit={handleCreatePost} className="mb-6">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="¿Qué tienes en mente?"
          className="w-full p-2 border rounded mb-2"
        ></textarea>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Publicar
        </button>
      </form>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={
                    post.user.profileImage ||
                    "https://source.unsplash.com/random/100x100?person"
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-2">
                  <p className="font-semibold">{post.user.fullname}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {post.user._id === user._id && (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
              )}
            </div>
            <p>{post.text}</p>
          </div>
        ))
      ) : (
        <p>No hay posts disponibles.</p>
      )}
    </div>
  );
};

export default Feed;
