const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads"); // ✅ Corrected: semicolon added
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4(); // Generate a unique identifier
    cb(null, uniqueName + path.extname(file.originalname)); // Optionally keep the original name
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
