import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import cloudinary from "../cloudinary.js"; // Configuración de Cloudinary
import bcrypt from "bcryptjs";


export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error en el controlador de getUserProfile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Enviar solicitud de amistad
export const sendFriendRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const userToRequest = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't send a friend request to yourself" });
    }

    if (!userToRequest || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Si ya envió la solicitud o ya son amigos
    if (
      currentUser.friends.includes(id) ||
      currentUser.friendRequestsSent.includes(id)
    ) {
      return res
        .status(400)
        .json({
          error: "Friend request already sent or user is already a friend",
        });
    }

    // Enviar la solicitud
    await User.findByIdAndUpdate(req.user._id, {
      $push: { friendRequestsSent: id },
    });
    await User.findByIdAndUpdate(id, {
      $push: { friendRequestsReceived: req.user._id },
    });

    //send notification
    const newNotification = new Notification({
      from: req.user._id,
      to: userToRequest._id,
      type: "friendRequest",
    });

    await newNotification.save();
    //TODO: return the id of the user as a response
    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error(
      "Error en el controlador de sendFriendRequest:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

// Aceptar solicitud de amistad
export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const userToAccept = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToAccept || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Si no hay solicitud de amistad pendiente
    if (!currentUser.friendRequestsReceived.includes(id)) {
      return res.status(400).json({ error: "No friend request found" });
    }

    // Agregar como amigos
    await User.findByIdAndUpdate(req.user._id, {
      $push: { friends: id },
      $pull: { friendRequestsReceived: id },
    });
    await User.findByIdAndUpdate(id, {
      $push: { friends: req.user._id },
      $pull: { friendRequestsSent: req.user._id },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(
      "Error en el controlador de acceptFriendRequest:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { username, email, password, bio } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar los campos solo si son proporcionados
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Perfil actualizado con éxito",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Error en updateUserProfile:", error.message);
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};





// Enviar solicitud de match
// Enviar solicitud de amistad
export const sendMatchRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const userToRequest = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't send a match request to yourself" });
    }

    if (!userToRequest || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Si ya envió la solicitud o ya son amigos
    if (
      currentUser.matches.includes(id) ||
      currentUser.matchRequestsSent.includes(id)
    ) {
      return res
        .status(400)
        .json({
          error: "Match request already sent or user is already a match",
        });
    }

    // Enviar la solicitud
    await User.findByIdAndUpdate(req.user._id, {
      $push: { matchRequestsSent: id },
    });
    await User.findByIdAndUpdate(id, {
      $push: { matchRequestsReceived: req.user._id },
    });

    //send notification
    const newNotification = new Notification({
      from: req.user._id,
      to: userToRequest._id,
      type: "matchRequest",
    });

    await newNotification.save();
    //TODO: return the id of the user as a response
    res.status(200).json({ message: "Match request sent" });
  } catch (error) {
    console.error(
      "Error en el controlador de sendMatchRequest:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};


//--

// Enviar solicitud de amistad
export const seeDetails = async (req, res) => {
  try {
    const users = await User.find({ _id: { $in: req.body.ids } });
    res.json(users);
  } catch (error) {
    console.error("Error al obtener detalles de usuarios:", error);
    res.status(500).json({ error: "Error al obtener detalles de usuarios" });
  }
};











// -----------------------------------------------------------------------------
//esta parte se deberia de hacer en base a los gustos de la persona
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Obtener el usuario actual
    const currentUser = await User.findById(userId).select("friends friendRequestsSent matchRequestsSent");

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Excluir amigos, solicitudes enviadas, y el usuario actual
    const excludedIds = [
      ...currentUser.friends,
      ...currentUser.friendRequestsSent,
      ...currentUser.matchRequestsSent,
      userId,
    ];

    // Obtener usuarios aleatorios excluyendo los mencionados
    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $nin: excludedIds } } },
      { $sample: { size: 10 } }, // Cambia el tamaño según tus necesidades
      { $project: { username: 1, fullname: 1, profileImage: 1 } },
    ]);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error en el controlador de getSuggestedUsers:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};


// idk si esta deberia de ser para otra cosa, hice correcciones para lo agregar amigos
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't add yourself as a friend" });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFriend = currentUser.friends.includes(id);
    if (isFriend) {
      //remove friend
      await User.findByIdAndUpdate(id, { $pull: { friends: req.user._id } });
      //await User.findByIdAndUpdate(req.user._id, { $pull: { friends: id } });

      // TODO return the id of the user as a response
      res.status(200).json({ message: "Friend removed successfully" });
    } else {
      //add friend
      await User.findByIdAndUpdate(id, { $push: { friends: req.user._id } });
      //await User.findByIdAndUpdate(req.user._id, { $push: { friends: id } });

      //send notification
      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "friend",
      });

      await newNotification.save();
      // TODO return the id of the user as a response
      res.status(200).json({ message: "Friend added successfully" });
    }
  } catch (error) {
    console.error("Error en el controlador de getUserFriends:", error.message);
    res.status(500).json({ error: error.message });
  }
};
