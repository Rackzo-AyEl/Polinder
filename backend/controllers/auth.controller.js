import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    // Validación básica de correo y contraseña
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password too short" });
    }

    // Verificar si el nombre de usuario o correo ya existen
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario con los campos adicionales
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
      // Los campos adicionales se inicializan automáticamente por defecto
    });

    // Guardar el usuario y generar el token
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    // Devolver la respuesta exitosa
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      email: newUser.email,
      profileImage: newUser.profileImage,
      coverImage: newUser.coverImage,
      bio: newUser.bio,
      link: newUser.link,
      matches: newUser.matches,
      friends: newUser.friends,
      friendRequests: newUser.friendRequests,
      matchRequests: newUser.matchRequests,
      blockedUsers: newUser.blockedUsers
    });
  } catch (error) {
    console.error("Error en el controlador de registro:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password, 
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generar token y almacenar en cookie
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      bio: user.bio,
      link: user.link,
      matches: user.matches,
      friends: user.friends,
      friendRequests: user.friendRequests,
      matchRequests: user.matchRequests,
      blockedUsers: user.blockedUsers
    });
  } catch (error) {
    console.error("Error en el controlador de login:", error.message);
    res.status(500).json({ error: "Error logging in" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error en el controlador de logout:", error.message);
    res.status(500).json({ error: "Error logging out" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      bio: user.bio,
      link: user.link,
      matches: user.matches,
      friends: user.friends,
      friendRequestsSent: user.friendRequestsSent,
      friendRequestsReceived: user.friendRequestsReceived,
      matches: user.matches,
      matchRequestsSent: user.matchRequestsSent,
      matchRequestsReceived: user.matchRequestsReceived,
      blockedUsers: user.blockedUsers
    });
  } catch (error) {
    console.error("Error en el controlador de getMe:", error.message);
    res.status(500).json({ error: "Error getting user" });
  }
};
