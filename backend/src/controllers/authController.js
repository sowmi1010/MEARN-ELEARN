const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const { isValidEmail, isValidPassword } = require("../utils/validators");

// =========================
// Email Transporter
// =========================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.trim(),
  },
  tls: { rejectUnauthorized: false },
});

transporter.verify((err) => {
  if (err) console.error("Mail setup failed:", err.message);
  else console.log("Mail server ready");
});

function normalizePermissions(perms = []) {
  return perms.map((p) => {
    if (p === "student") return "students";
    if (p === "courses") return "videos";
    if (p === "transaction") return "payments";
    return p;
  });
}

// =========================
// REGISTER (Fixed)
// =========================
exports.register = async (req, res) => {
  try {
    const { name, userId, email, phone, password, role, isSuperAdmin } = req.body;

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidPassword(password))
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });

    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser)
      return res.status(400).json({
        message: "Email or User ID already exists",
      });

    // No manual hashing — User model handles hashing safely
    const user = await User.create({
      name,
      userId,
      email,
      phone,
      password, 
      role: role || "student",
      isSuperAdmin: isSuperAdmin || false,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSuperAdmin: !!user.isSuperAdmin,
        profilePic: user.profilePic,
        permissions: user.permissions || [],
        enrolledCourses: user.enrolledCourses || [],
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// LOGIN (Fixed)
// =========================
exports.login = async (req, res) => {
  try {
    const { emailOrUserId, password } = req.body;
    if (!emailOrUserId || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const plainPwd = password.trim();

    let role = "student";
    let profilePic = "";
    let permissions = [];
    let isSuperAdmin = false;

// 3 Try Mentor
const mentor = await Mentor.findOne({
  $or: [
    { email: emailOrUserId.trim().toLowerCase() },
    { userId: emailOrUserId.trim() },
  ],
});

if (mentor) {
  console.log("Mentor found:", mentor.email);
  role = "mentor";
  profilePic = mentor.photo || "";

  // Use real permissions from DB
  const permissions = mentor.permissions || [];

  const isMatch = await mentor.comparePassword(password.trim());
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: mentor._id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    token,
    user: {
      id: mentor._id,
      name: `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim(),
      userId: mentor.userId,
      email: mentor.email,
      role,
      isSuperAdmin: false,
      profilePic,
      permissions,
    },
  });
}


    // =========================
    // 2️ Try Admin
    // =========================

    const admin = await Admin.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (admin) {
      role = "admin";
      isSuperAdmin = !!admin.isSuperAdmin;
      profilePic = admin.photo || "";

      const dbPwd = admin.password || "";
      let isMatch = false;

      if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
        isMatch = await bcrypt.compare(plainPwd, dbPwd);
      } else if (dbPwd === plainPwd) {
        admin.password = await bcrypt.hash(plainPwd, 10);
        await admin.save();
        isMatch = true;
      }

      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin._id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          id: admin._id,
          name: `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
          userId: admin.userId,
          email: admin.email,
          role,
          isSuperAdmin,
          profilePic,
          permissions: [
            "dashboard",
            "home",
            "courses",
            "admin",
            "mentor",
            "students",
            "payments",
            "feedbacks",
          ], // full access for admin
        },
      });
    }

    // =========================
    // 3️ Try Student
    // =========================
    const student = await Student.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (student) {
      role = "student";
      profilePic = student.photo || "";

      const dbPwd = student.password || "";
      let isMatch = false;

      if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
        isMatch = await bcrypt.compare(plainPwd, dbPwd);
      } else if (dbPwd === plainPwd) {
        student.password = await bcrypt.hash(plainPwd, 10);
        await student.save();
        isMatch = true;
      }

      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: student._id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          id: student._id,
          name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          userId: student.userId,
          email: student.email,
          role,
          isSuperAdmin: false,
          profilePic,
          permissions: ["dashboard", "courses"], // base permissions for students
        },
      });
    }

    // =========================
    // 4️ Try User
    // =========================
    const user = await User.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (user) {
      role = user.role;
      profilePic = user.profilePic || "";

      const isMatch = await bcrypt.compare(plainPwd, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          userId: user.userId,
          email: user.email,
          role,
          isSuperAdmin: !!user.isSuperAdmin,
          profilePic,
          permissions: user.permissions || [],
        },
      });
    }

    // Not found
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// Forgot / Reset Password
// =========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"Last Try Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      html: `<h2>Your Reset Code</h2><p><b>${code}</b></p><p>Valid for 10 minutes.</p>`,
    });

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Email send failed", error: err.message });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired code" });
    res.json({ message: "Code verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = "";
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
