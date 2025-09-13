const Video = require("../models/Video");
const Course = require("../models/Course");

// ✅ Upload video locally
const uploadVideo = async (req, res) => {
  try {
    const { courseId, title, lesson, description, duration } = req.body;

    if (!courseId || !title || !req.file) {
      return res.status(400).json({ message: "Course, title and file are required" });
    }

    const video = await Video.create({
      course: courseId,
      title,
      lesson,
      description,
      duration,
      filePath: req.file.path, // local file path
    });

    await Course.findByIdAndUpdate(courseId, { $push: { videos: video._id } });

    res.json(video);
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Failed to upload video", error: err.message });
  }
};

// ✅ Stream video (send local file)
const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.sendFile(video.filePath, { root: "." }); // serve local file
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadVideo, streamVideo };
