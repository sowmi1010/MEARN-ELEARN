const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); 
const {
  addNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

//  Ensure upload folders exist
const rootUploadDir = path.resolve(__dirname, "../../uploads");
const noteDir = path.join(rootUploadDir, "notes");
const thumbDir = path.join(rootUploadDir, "thumbnails");

[noteDir, thumbDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, thumbDir);
    else cb(null, noteDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

const upload = multer({ storage });

// Routes

// Add new note
router.post(
  "/upload",
  auth,
  checkPermission("notes"), 
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addNote
);

// Get all notes
router.get("/", auth, getNotes); // Accessible to all authenticated users (students/mentors/admins)

// Get single note
router.get("/:id", auth, getNoteById);

// Update note
router.put(
  "/:id",
  auth,
  checkPermission("notes"), 
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateNote
);

// Delete note
router.delete("/:id", auth, checkPermission("notes"), deleteNote); 

module.exports = router;
