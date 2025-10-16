const Video = require("../models/Video");
const Course = require("../models/Course");
const fs = require("fs");
const path = require("path");

 // Add New Video
exports.addVideo = async (req, res) => {
  try {
    const {
      group,
      standard,
      board,
      language,
      subject,
      lesson,
      category,
      videoNumber,
      title,
      aboutCourse,
      course,
    } = req.body;

    if (!group || !standard || !board || !language || !subject || !lesson || !category || !title) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Always store relative paths (not absolute Windows paths)
    const thumbnail = req.files?.thumbnail?.[0]
      ? path.relative(path.join(__dirname, ".."), req.files.thumbnail[0].path).replace(/\\/g, "/")
      : null;

    const file = req.files?.file?.[0]
      ? path.relative(path.join(__dirname, ".."), req.files.file[0].path).replace(/\\/g, "/")
      : null;


    if (!thumbnail || !file) {
      return res.status(400).json({ message: "Both thumbnail and video file are required" });
    }

    const newVideo = await Video.create({
      group,
      standard,
      board,
      language,
      subject,
      lesson,
      category,
      videoNumber,
      title,
      aboutCourse,
      thumbnail,
      file,
      course: course || null,
    });

    if (course) {
      await Course.findByIdAndUpdate(course, { $push: { videos: newVideo._id } });
    }

    res.status(201).json({ message: "Video added successfully", video: newVideo });
  } catch (err) {
    console.error("addVideo error:", err);
    res.status(500).json({ message: "Failed to add video", error: err.message });
  }
};

 // Get All Videos (Smart Filtering)

exports.getVideos = async (req, res) => {
  try {
    const { group, standard, board, language, subject, lesson, category, search } = req.query;
    const filter = {};

    // Match base fields case-insensitively
    if (group) filter.group = new RegExp(`^${group}$`, "i");
    if (standard) filter.standard = new RegExp(`^${standard}$`, "i");
    if (board) filter.board = new RegExp(`^${board}$`, "i");
    if (language) filter.language = new RegExp(`^${language}$`, "i");
    if (subject) filter.subject = new RegExp(`^${subject}$`, "i");
    if (lesson) filter.lesson = new RegExp(`^${lesson}$`, "i");

    /**
     * Smarter Category Logic
     * - If category = "videos" → fetch all categories (Lesson, One Word, etc.)
     * - Else → filter by specific category (Lesson, One Word, etc.)
     */
    if (category) {
      const normalized = category.trim().toLowerCase();

      if (normalized === "videos" || normalized === "all videos") {
        // Do not filter category — fetch all videos under that subject
      } else {
        filter.category = new RegExp(`^${category}$`, "i");
      }
    }

    // Optional text search (title/aboutCourse)
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { aboutCourse: new RegExp(search, "i") },
      ];
    }

    console.log("Final Video Filter:", filter);

    const videos = await Video.find(filter).sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    console.error("getVideos error:", err);
    res.status(500).json({ message: "Failed to fetch videos", error: err.message });
  }
};


// Get Single Video by ID

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("course", "title").lean();

    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json(video);
  } catch (err) {
    console.error("getVideoById error:", err);
    res.status(500).json({ message: "Failed to fetch video", error: err.message });
  }
};


// Update Video

exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const updates = req.body;

    // Replace files if new ones are uploaded
    if (req.files?.thumbnail?.[0]) {
      if (video.thumbnail && fs.existsSync(video.thumbnail)) fs.unlinkSync(video.thumbnail);
      updates.thumbnail = req.files.thumbnail[0].path;
    }

    if (req.files?.file?.[0]) {
      if (video.file && fs.existsSync(video.file)) fs.unlinkSync(video.file);
      updates.file = req.files.file[0].path;
    }

    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Video updated successfully", video: updatedVideo });
  } catch (err) {
    console.error("updateVideo error:", err);
    res.status(500).json({ message: "Failed to update video", error: err.message });
  }
};


//  Delete Video

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.thumbnail && fs.existsSync(video.thumbnail)) fs.unlinkSync(video.thumbnail);
    if (video.file && fs.existsSync(video.file)) fs.unlinkSync(video.file);

    if (video.course) {
      await Course.findByIdAndUpdate(video.course, { $pull: { videos: video._id } });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("deleteVideo error:", err);
    res.status(500).json({ message: "Failed to delete video", error: err.message });
  }
};


// Get Total Video Count

exports.getVideoCount = async (req, res) => {
  try {
    const total = await Video.countDocuments({});
    res.status(200).json({ total });
  } catch (err) {
    console.error("getVideoCount error:", err);
    res.status(500).json({ message: "Failed to fetch video count", error: err.message });
  }
};
