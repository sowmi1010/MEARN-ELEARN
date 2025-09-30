const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const { isValidEmail, isValidPassword } = require("../utils/validators");

// Normalize mentor permissions
function normalizePermissions(perms = []) {
  return perms.map((p) => {
    if (p === "student") return "students";
    if (p === "courses") return "videos";
    if (p === "transaction") return "payments";
    return p;
  });
}

// ==================
// Register new user
// ==================
async function register(req, res) {
  try {
    const { name, userId, email, phone, password, role, isSuperAdmin } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or User ID already registered" });
    }

    const user = await User.create({
      name,
      userId,
      email,
      phone,
      password,
      role,
      isSuperAdmin: isSuperAdmin || false,     // ✅ allow SuperAdmin creation
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
        isSuperAdmin: !!user.isSuperAdmin,      // ✅ include flag
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
// Login
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
    let isSuperAdmin = false;

    // 1️⃣ Try User collection
    user = await User.findOne({
      $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
    });

    if (user) {
      // ✅ detect super admin
      isSuperAdmin = !!user.isSuperAdmin;
      role = isSuperAdmin ? "admin" : user.role;
      profilePic = user.profilePic;
      enrolledCourses = user.enrolledCourses || [];
    }

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

    // 3️⃣ If still not found → try Student (manually added)
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
        name: user.name || `${user.firstName || ""} ${user.lastName || ""}`,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        role,
        isSuperAdmin,                            // ✅ include flag
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
