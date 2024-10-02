import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    profileImage: {
        type: String,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
        maxlength: 2000,
    },
    /*link: {
        type: String,
        required: true,
    }, me falta lo de la boleta*/
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    semester: {
        type: String,
        default: '',
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
 