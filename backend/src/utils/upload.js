// utils/upload.js
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Set up Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../uploads/")); // Save files to 'uploads/' folder
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = uuidv4(); // สร้างชื่อไฟล์ที่ไม่ซ้ำ
        console.log('Generated filename:', uniqueName + ext);  // ตรวจสอบชื่อไฟล์ที่สร้างขึ้น
        cb(null, uniqueName + ext); // คืนค่าชื่อไฟล์ที่ถูกต้อง
    }
});

// Configure Multer upload settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"), false); // Reject non-image files
        }
    }
}).single("image"); // This expects an "image" field in the form-data

module.exports = upload;
