const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const Video = require("../models/Video");
const Course = require("../models/Course");

// 📂 Ensure uploads/videos folder exists
const uploadDir = path.join(__dirname, "../../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📂 Storage config for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

/**
 * ✅ Admin: upload video
 */
router.post(
  "/upload",
  auth,
  role("admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { courseId, title, lesson, description, duration } = req.body;

      if (!courseId || !title || !req.file) {
        return res
          .status(400)
          .json({ message: "Course, title, and file are required" });
      }

      // save video in DB (store filePath)
      const video = await Video.create({
        course: courseId,
        title,
        lesson,
        description,
        duration,
        filePath: req.file.path,
      });

      // link video to course
      await Course.findByIdAndUpdate(courseId, {
        $push: { videos: video._id },
      });

      res.json(video);
    } catch (err) {
      console.error("❌ Upload error:", err);
      res
        .status(500)
        .json({ message: "Failed to upload video", error: err.message });
    }
  }
);

/**
 * ✅ Get all videos (admin only)
 */
router.get("/", auth, role("admin"), async (req, res) => {
  try {
    const videos = await Video.find().populate("course", "title");
    res.json(videos);
  } catch (err) {
    console.error("❌ Fetch videos error:", err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

/**
 * ✅ Stream video (with range support)
 */
router.get("/stream/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const filePath = path.resolve(video.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      return res.status(400).send("Range header required");
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return res
        .status(416)
        .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4", // adjust if needed
    };

    res.writeHead(206, head);
    file.pipe(res);
  } catch (err) {
    console.error("❌ Stream error:", err);
    res.status(500).json({ message: "Failed to stream video" });
  }
});

// ✅ Delete video
router.delete("/:id", auth, role("admin"), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // remove file from disk
    if (video.filePath && fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }

    // remove video from course
    await Course.findByIdAndUpdate(video.course, {
      $pull: { videos: video._id },
    });

    await video.deleteOne();

    res.json({ message: "✅ Video deleted successfully" });
  } catch (err) {
    console.error("❌ Delete video error:", err);
    res.status(500).json({ message: "Failed to delete video" });
  }
});

// ✅ Update video metadata (title, lesson, description, duration)
router.put("/:id", auth, role("admin"), async (req, res) => {
  try {
    const { title, lesson, description, duration } = req.body;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, lesson, description, duration },
      { new: true }
    );

    res.json(video);
  } catch (err) {
    console.error("❌ Update video error:", err);
    res.status(500).json({ message: "Failed to update video" });
  }
});

module.exports = router;
