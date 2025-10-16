require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

/* ======================================================
   ✅ 1. Ensure all upload folders exist
====================================================== */
const uploadDirs = [
  "uploads",
  "uploads/profile",
  "uploads/videos",
  "uploads/admins",
  "uploads/students",
  "uploads/mentors",
  "uploads/teachers",
  "uploads/feedback",
  "uploads/books",
  "uploads/notes",
  "uploads/tests",
  "uploads/thumbnails",
];

uploadDirs.forEach((dir) => {
  const fullPath = path.resolve(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📂 Created missing folder: ${dir}`);
  }
});

/* ======================================================
   ✅ 2. Middleware setup
====================================================== */
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve uploaded files correctly
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"), {
    setHeaders: (res) => {
      // Enables PDF/image preview in React <iframe> and <img>
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

/* ======================================================
   3. MongoDB Connection
====================================================== */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elearn";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ======================================================
   ✅ 4. Import all routes
====================================================== */
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoutes");
const noteRoutes = require("./routes/noteRoutes");
const bookRoutes = require("./routes/bookRoutes");
const testRoutes = require("./routes/testRoutes");
const quizRoutes = require("./routes/quizRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const studentRoutes = require("./routes/studentRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

/* ======================================================
   ✅ 5. Register API routes
====================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/feedbacks", feedbackRoutes);

/* ======================================================
   ✅ 6. Health check
====================================================== */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/* ======================================================
   ✅ 7. Error handling
====================================================== */
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ======================================================
   ✅ 8. Unknown API routes
====================================================== */
app.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

/* ======================================================
   ✅ 9. Serve frontend (Vite/CRA)
====================================================== */
const frontendPath = path.resolve(__dirname, "../frontend/dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

/* ======================================================
   ✅ 10. Start Server
====================================================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🖼️ Uploads available at http://localhost:${PORT}/uploads`);
});

module.exports = app;
