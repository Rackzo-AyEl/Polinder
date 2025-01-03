import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta temporal para los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Archivo recibido para validación:", file);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Aceptar solo imágenes
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};



const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño: 5MB
});

export default upload;
