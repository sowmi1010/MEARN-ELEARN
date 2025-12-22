const express = require("express");
const router = express.Router();
const Live = require("../models/Live");
const auth = require("../middlewares/auth");
const multer = require("multer");
const fs = require("fs");

/* =========================
   UPLOAD CONFIG
========================= */
const uploadDir = "uploads/live";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

/* =========================
   ADMIN → CREATE LIVE
========================= */
router.post("/", auth, upload.single("thumbnail"), async (req, res) => {
  try {
    const live = await Live.create({
      ...req.body,
      thumbnail: req.file ? req.file.path : null,
      status: "upcoming",
    });

    res.status(201).json(live);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create live" });
  }
});

/* =========================
   STUDENT → UPCOMING LIVE ✅ FIXED
========================= */
// STUDENT → UPCOMING LIVE (COURSE BASED ✅)
router.get("/upcoming", async (req, res) => {
  try {
    const {
      group,
      standard,
      board,
      language,
      subject,
      groupCode,
    } = req.query;

    const query = {
      status: "upcoming",
    };

    if (group) query.group = group;
    if (standard) query.standard = standard;
    if (groupCode) query.groupCode = groupCode;
    if (board) query.board = board;
    if (language) query.language = language;
    if (subject) query.subject = subject;

    const lives = await Live.find(query)
      .sort({ date: 1, time: 1 })
      .lean();

    res.json(lives);
  } catch (err) {
    console.error("Upcoming live error:", err);
    res.status(500).json([]);
  }
});


router.get("/", auth, async (req, res) => {
  try {
    const { group, standard, board, language, subject, category } = req.query;

    const query = {};
    if (group) query.group = group;
    if (standard) query.standard = standard;
    if (board) query.board = board;
    if (language) query.language = language;
    if (subject) query.subject = subject;
    if (category) query.category = category;

    const lives = await Live.find(query).sort({ date: 1 });
    res.json(lives);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch live classes" });
  }
});


module.exports = router;
