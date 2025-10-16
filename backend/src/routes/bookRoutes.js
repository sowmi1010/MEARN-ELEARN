const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); // Replaced role() with permission-based access

// Ensure folders exist
const uploadDir = path.join(__dirname, "../../uploads/books");
const thumbDir = path.join(__dirname, "../../uploads/thumbnails");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, thumbDir);
    else cb(null, uploadDir);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });


// Upload Book (Admin or Mentor with “books” permission)
router.post(
  "/upload",
  auth,
  checkPermission("books"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addBook
);

// Get all Books (All logged-in users)
router.get("/", auth, getBooks);

// Get one Book
router.get("/:id", auth, getBookById);

// Update Book (Admin or Mentor with “books” permission)
router.put(
  "/:id",
  auth,
  checkPermission("books"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

// Delete Book (Admin or Mentor with “books” permission)
router.delete("/:id", auth, checkPermission("books"), deleteBook);

module.exports = router;
