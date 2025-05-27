import multer from "multer";
// config/multer.js
// const multer = require('multer');
// const path = require('path');
import path from 'path'
// Define storage path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp'); // folder must exist
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });

