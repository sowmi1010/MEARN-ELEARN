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
  getVideoCount,
} = require("../controllers/videoController");

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission");
const { markVideoWatched } = require("../controllers/videoController");


// Ensure upload folders exist
const baseUploadDir = path.join(__dirname, "../../uploads");
const uploadDir = path.join(baseUploadDir, "videos");
const thumbDir = path.join(baseUploadDir, "thumbnails");

[uploadDir, thumbDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created folder: ${dir}`);
  }
});

// Configure multer storage
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
    cb(new Error("Invalid file type"), false);
  } else cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Normalize Uploaded Paths
const normalizePaths = (req, res, next) => {
  if (req.files?.thumbnail?.[0]) {
    req.files.thumbnail[0].path = "uploads/thumbnails/" + path.basename(req.files.thumbnail[0].path);
  }
  if (req.files?.file?.[0]) {
    req.files.file[0].path = "uploads/videos/" + path.basename(req.files.file[0].path);
  }
  next();
};


// Add Video (Admin or Mentor with “videos” permission)
router.post(
  "/upload",
  auth,
  checkPermission("videos"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  normalizePaths,
  addVideo
);

// Get total video count
router.get("/count/total", auth, getVideoCount);

// Get all videos (accessible to all authenticated users)
router.get("/", auth, getVideos);

// Get single video
router.get("/:id", auth, getVideoById);

// Update Video (Admin or Mentor with “videos” permission)
router.put(
  "/:id",
  auth,
  checkPermission("videos"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  normalizePaths,
  updateVideo
);

router.post("/watch/:id", auth, markVideoWatched);


// Delete Video (Admin or Mentor with “videos” permission)
router.delete("/:id", auth, checkPermission("videos"), deleteVideo);

module.exports = router;
