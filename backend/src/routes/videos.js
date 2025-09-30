// backend/routes/videos.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const Video = require("../models/Video");
const Course = require("../models/Course");
const User = require("../models/User");
const Student = require("../models/Student"); // ✅ added Student model

// 📂 Ensure uploads/videos folder exists
const uploadDir = path.join(__dirname, "../../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📂 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

/**
 * ✅ Admin: upload video
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { courseId, title, lesson, description, duration } = req.body;

    if (!courseId || !title || !req.file) {
      return res
        .status(400)
        .json({ message: "Course, title, and file are required" });
    }

    const video = await Video.create({
      course: courseId,
      title,
      lesson,
      description,
      duration,
      filePath: req.file.path,
    });

    await Course.findByIdAndUpdate(courseId, { $push: { videos: video._id } });

    res.json(video);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res
      .status(500)
      .json({ message: "Failed to upload video", error: err.message });
  }
});

/**
 * ✅ Stream video — verifies token & enrollment
 */
router.get("/stream/:id", async (req, res) => {
  try {
    // 🔑 Extract token
    let token = req.query.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return res.status(401).json({ message: "Unauthorized: token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔎 Look up viewer in all possible collections
    let viewer =
      (await User.findById(decoded.id)) || (await Student.findById(decoded.id));

    if (!viewer) {
      return res
        .status(401)
        .json({ message: "Unauthorized: account not found" });
    }

    // 🔎 Load video & course
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const course = await Course.findById(video.course).select(
      "enrolledStudents teacher"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });

    // ✅ Check access: admins/teachers or enrolled students
    const isAdmin = viewer.role === "admin";
    const isTeacher =
      course.teacher && course.teacher.toString() === viewer._id.toString();

    const isEnrolled =
      (viewer.enrolledCourses || []).some(
        (c) => c && c.toString() === course._id.toString()
      ) ||
      (course.enrolledStudents || []).some(
        (s) => s && s.toString() === viewer._id.toString()
      );

    if (!isAdmin && !isTeacher && !isEnrolled) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    // 🔎 Stream file
    const filePath = path.resolve(video.filePath);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "File not found" });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (!range) return res.status(400).send("Range header required");

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
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } catch (err) {
    console.error("❌ Stream error:", err);
    res.status(500).json({ message: "Failed to stream video" });
  }
});

/**
 * ✅ Delete video
 */
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.filePath && fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }

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

module.exports = router;
