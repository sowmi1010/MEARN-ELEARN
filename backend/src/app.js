// backend/src/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Ensure upload folders exist
const uploadDirs = [
  "uploads",
  "uploads/profile",
  "uploads/videos",
  "uploads/admins",
  "uploads/students",
  "uploads/mentors",
];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(path.join(__dirname, "..", dir))) {
    fs.mkdirSync(path.join(__dirname, "..", dir), { recursive: true });
    console.log(`📂 Created missing folder: ${dir}`);
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elearn";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const courseRoutes = require("./routes/courses");
const videoRoutes = require("./routes/videos");
const paymentRoutes = require("./routes/payments");
const categoryRoutes = require("./routes/categories");
const studentRoutes = require("./routes/student");
const mentorRoutes = require("./routes/mentor"); // ✅ use THIS one

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/mentor", mentorRoutes); // ✅ registered here

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ API 404 handler (Express v5 safe)
app.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ✅ Serve frontend for non-API routes
const frontendPath = path.join(__dirname, "../frontend/dist"); // CRA = build, Vite = dist
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🖼️ Uploads available at http://localhost:${PORT}/uploads`);
});

module.exports = app;
