// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student"); // ✅ Added Student model
const { isValidEmail, isValidPassword } = require("../utils/validators");

// ==================
// Helper: normalize permission keys
// ==================
function normalizePermissions(perms = []) {
  return perms.map((p) => {
    if (p === "student") return "students";       // match AdminLayout
    if (p === "courses") return "videos";        // match Upload/Manage Videos
    if (p === "transaction") return "payments";  // match Payments
    return p;
  });
}

// ==================
// Register new user (Admins & Students only)
// ==================
async function register(req, res) {
  try {
    const { name, userId, email, phone, password, role } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or User ID already registered" });
    }

    // Admin / Student only
    const user = await User.create({
      name,
      userId,
      email,
      phone,
      password,
      role, // "admin" | "student"
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        permissions: user.permissions || [],
        enrolledCourses: user.enrolledCourses || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// ==================
// Login (Admin / Student / Mentor / Manually-added Student)
// ==================
async function login(req, res) {
  try {
    const { emailOrUserId, password } = req.body;
    console.log("🔑 Login attempt:", { emailOrUserId });

    let user = null;
    let role = "student";
    let permissions = [];
    let profilePic = "";
    let enrolledCourses = [];

    // 1️⃣ Try User collection (Admin / Student registered via signup)
    user = await User.findOne({
      $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
    });

    // 2️⃣ If not found → try Mentor
    if (!user) {
      const mentor = await Mentor.findOne({
        $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
      });
      if (mentor) {
        user = mentor;
        role = "mentor";
        profilePic = mentor.photo;
        permissions = normalizePermissions(mentor.permissions || []);
      }
    }

    // 3️⃣ If still not found → try Student (manually added by admin)
    if (!user) {
      const student = await Student.findOne({
        $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
      });
      if (student) {
        user = student;
        role = "student";
        profilePic = student.photo;
        enrolledCourses = student.enrolledCourses || [];
      }
    }

    // 4️⃣ If still not found
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 5️⃣ Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 6️⃣ Generate token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name || `${user.firstName} ${user.lastName || ""}`,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        role,
        profilePic,
        permissions,
        enrolledCourses: enrolledCourses.length
          ? enrolledCourses
          : user.enrolledCourses || [],
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { register, login };
