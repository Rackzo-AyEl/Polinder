import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

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
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        
        if (id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't add yourself as a friend" });
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
        } else{
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
}   

//esta parte se deberia de hacer en base a los gustos de la persona
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId =req.user._id
        const usersFriendsByMe = await User.findById(userId).select("")
    } catch (error) {
        console.error("Error en el controlador de getSuggestedUsers:", error.message);
        res.status(500).json({ error: error.message });
    }
}