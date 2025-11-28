require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const chatSocket = require("./socket/chatSocket");
const liveSocket = require("./socket/liveSocket");


const app = express();
const PORT = process.env.PORT || 4000;

/* ======================================================
   ✅ 1. Ensure upload folders exist
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
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

/* ======================================================
   ✅ 2. Middleware setup
====================================================== */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve uploads
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"), {
    setHeaders: (res) => res.set("Cross-Origin-Resource-Policy", "cross-origin"),
  })
);

/* ======================================================
   ✅ 3. MongoDB Connection
====================================================== */
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elearn", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ======================================================
   ✅ 4. Import all routes
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
const categoryRoutes = require("./routes/categoryRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentDashboardRoutes = require('./routes/studentDashboardRoutes')
const mentorRoutes = require("./routes/mentorRoutes");
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userLookupRoutes = require("./routes/userLookupRoutes");
const todoRoutes = require("./routes/todoRoutes")
const marks = require("./routes/marks")
const certificateRoutes = require("./routes/certificateRoutes")

/* ======================================================
   ✅ 5. Register API routes (ORDER MATTERS)
====================================================== */
app.use("/api/chat", require("./routes/chat.public"));
app.use("/api/auth", authRoutes); // <-- Must be registered before 404 handler
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student/dashboard", studentDashboardRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat/user", userLookupRoutes);
app.use("/api/todos", todoRoutes)
app.use("/api/marks", marks)
app.use("/api/certificates", certificateRoutes)
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
   ✅ 8. Unknown API route handler (AFTER ALL ROUTES)
====================================================== */
app.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

/* ======================================================
   ✅ 9. Frontend serve
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
   ✅ 10. Socket.io + Server Init
====================================================== */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
});


chatSocket(io);
liveSocket(io);


/* ======================================================
   ✅ 11. Start Server
====================================================== */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API at http://localhost:${PORT}/api`);
});

module.exports = app;
