import express from 'express';
import authRoutes from './routes/auth.routes.js'; 
import userRoutes from './routes/user.routes.js'; 
import postRoutes from './routes/post.routes.js'; 

import cors from 'cors'; // Importa CORS


import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

import {v2 as cloudinary} from 'cloudinary'
import upload from './multer.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();

// Middleware de CORS
app.use(cors({
    origin: 'http://localhost:3000', // Cambia al puerto donde corre tu frontend
    credentials: true, // Habilita cookies si es necesario
}));

const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

app.use("/api/users/update", upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
])); // Multer debe ejecutarse antes de express.json()

console.log(process.env.CLOUDINARY_CLOUD_NAME, // Nombre de tu cuenta
    process.env.CLOUDINARY_API_KEY,       // API Key
process.env.CLOUDINARY_API_SECRET); // API Secret)

app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
    console.log(process.env.CLOUDINARY_CLOUD_NAME, // Nombre de tu cuenta
        process.env.CLOUDINARY_API_KEY,       // API Key
    process.env.CLOUDINARY_API_SECRET); // API Secret)
    connectMongoDB();
});
