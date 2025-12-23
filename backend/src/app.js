require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const chatSocket = require("./socket/chatSocket");
const liveSocket = require("./socket/liveSocket");

const app = express();
const PORT = process.env.PORT || 4000;

/* ======================================================
   1️⃣ Ensure upload folders exist
====================================================== */
const uploadDirs = [
  "uploads",
  "uploads/users",
  "uploads/courses",
  "uploads/content",
  "uploads/feedback",
];

uploadDirs.forEach((dir) => {
  const fullPath = path.resolve(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

/* ======================================================
   2️⃣ Middleware
====================================================== */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve uploads */
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"), {
    setHeaders: (res) =>
      res.set("Cross-Origin-Resource-Policy", "cross-origin"),
  })
);

/* ======================================================
   3️⃣ MongoDB Connection
====================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ======================================================
   4️⃣ Import Routes
====================================================== */
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoutes");
const liveRoutes = require("./routes/liveRoutes");
const noteRoutes = require("./routes/noteRoutes");
const bookRoutes = require("./routes/bookRoutes");
const testRoutes = require("./routes/testRoutes");
const quizRoutes = require("./routes/quizRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatPublicRoutes = require("./routes/chat.public");
const userLookupRoutes = require("./routes/userLookupRoutes");
const todoRoutes = require("./routes/todoRoutes");
const marksRoutes = require("./routes/marks");
const certificateRoutes = require("./routes/certificateRoutes");
const profileRoutes = require("./routes/common/profileRoutes");

/* ======================================================
   5️⃣ Register API Routes
====================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student/dashboard", studentDashboardRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat/public", chatPublicRoutes);
app.use("/api/chat/user", userLookupRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/profile", profileRoutes);

/* ======================================================
   6️⃣ Health Check
====================================================== */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/* ======================================================
   7️⃣ Error Handler
====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ======================================================
   8️⃣ Unknown API Routes
====================================================== */
app.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

/* ======================================================
   9️⃣ Serve Frontend (Production)
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
   🔟 Socket.io Setup
====================================================== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

chatSocket(io);
liveSocket(io);

/* ======================================================
   1️⃣1️⃣ Start Server
====================================================== */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

module.exports = app;
