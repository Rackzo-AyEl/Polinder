import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    console.log("Datos recibidos:", { username, fullname, email, password });

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      console.log("Email inválido:", email);
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      console.log("Contraseña demasiado corta:", password);
      return res.status(400).json({ error: "Password too short" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("El nombre de usuario ya existe:", username);
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("El correo electrónico ya existe:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Contraseña hasheada:", hashedPassword);

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
    });

    console.log("Nuevo usuario creado:", newUser);

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

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
      });
    } else {
      console.log("Error al crear el usuario:", newUser);
      res.status(400).json({ error: "Error creating user" });
    }
  } catch (error) {
    console.error("Error en el controlador de registro:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const ispasswordCorrect = await bcrypt.compare(
      password, 
      user?.password || ""
    );

    if (!user || !ispasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

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
    });
  } catch (error) {
    console.error("Error en el controlador de login:", error.message);
    res.status(500).json({ error: "Error logging in" });
  }
};

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error en el controlador de logout:", error.message);
        res.status(500).json({ error: "Error logging out" });
    }
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error("Error en el controlador de getMe:", error.message);
        res.status(500).json({ error: "Error getting user" });
    }
};