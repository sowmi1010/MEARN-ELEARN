const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideoCount, // ✅ Added
} = require("../controllers/videoController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// ====================================================
// ✅ Ensure upload folders exist
// ====================================================
const baseUploadDir = path.join(__dirname, "../../uploads");
const uploadDir = path.join(baseUploadDir, "videos");
const thumbDir = path.join(baseUploadDir, "thumbnails");

[uploadDir, thumbDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Created folder: ${dir}`);
  }
});

// ====================================================
// ✅ Configure multer storage (relative path normalization)
// ====================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, thumbDir);
    else cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "video/mp4",
    "video/mkv",
    "video/webm",
    "image/jpeg",
    "image/png",
  ];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("❌ Invalid file type"), false);
  } else cb(null, true);
};

const upload = multer({ storage, fileFilter });

// ====================================================
// ✅ Middleware: Normalize Uploaded Paths
// ====================================================
const normalizePaths = (req, res, next) => {
  if (req.files?.thumbnail?.[0]) {
    req.files.thumbnail[0].path = path
      .relative(baseUploadDir, req.files.thumbnail[0].path)
      .replace(/\\/g, "/");
    req.files.thumbnail[0].path = "uploads/" + req.files.thumbnail[0].path;
  }

  if (req.files?.file?.[0]) {
    req.files.file[0].path = path
      .relative(baseUploadDir, req.files.file[0].path)
      .replace(/\\/g, "/");
    req.files.file[0].path = "uploads/" + req.files.file[0].path;
  }

  next();
};

// ====================================================
// ✅ ROUTES
// ====================================================

// 🟢 Add Video
router.post(
  "/upload",
  auth,
  role("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  normalizePaths,
  addVideo
);

// 🟢 Get total video count (MUST be before :id)
router.get("/count/total", auth, getVideoCount);

// 🟢 Get all videos
router.get("/", auth, getVideos);

// 🟢 Get single video
router.get("/:id", auth, getVideoById);

// 🟢 Update video
router.put(
  "/:id",
  auth,
  role("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  normalizePaths,
  updateVideo
);

// 🟢 Delete video
router.delete("/:id", auth, role("admin"), deleteVideo);

module.exports = router;
