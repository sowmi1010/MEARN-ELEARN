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
const role = require("../middlewares/role");

// 📂 Ensure folders exist
const uploadDir = path.join(__dirname, "../../uploads/books");
const thumbDir = path.join(__dirname, "../../uploads/thumbnails");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// 📦 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, thumbDir);
    else cb(null, uploadDir);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ✅ Routes
router.post(
  "/upload",
  auth,
  role("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addBook
);

router.get("/", auth, getBooks);
router.get("/:id", auth, getBookById);
router.put(
  "/:id",
  auth,
  role("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
router.delete("/:id", auth, role("admin"), deleteBook);

module.exports = router;
