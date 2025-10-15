const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const {
  addTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} = require("../controllers/testController");

// Ensure upload folders
const testDir = path.join(__dirname, "../../uploads/tests");
const thumbDir = path.join(__dirname, "../../uploads/thumbnails");
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, thumbDir);
    else cb(null, testDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/upload",
  auth,
  role("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addTest
);

router.get("/", auth, getTests);
router.get("/:id", auth, getTestById);

router.put(
  "/:id",
  auth,
  role("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateTest
);

router.delete("/:id", auth, role("admin"), deleteTest);

module.exports = router;
