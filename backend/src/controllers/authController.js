const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const { isValidEmail, isValidPassword } = require("../utils/validators");

// =========================
// Email Transporter Setup
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
  else console.log("✅ Mail server ready");
});

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { name, userId, email, phone, password, role, isSuperAdmin } = req.body;

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidPassword(password))
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser)
      return res.status(400).json({ message: "Email or User ID already exists" });

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
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// LOGIN (All roles handled)
// =========================
exports.login = async (req, res) => {
  try {
    const { emailOrUserId, password } = req.body;
    if (!emailOrUserId || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const plainPwd = password.trim();
    let role = "student";
    let profilePic = "";
    let isSuperAdmin = false;

    // =========================
    // 1️⃣ Mentor Login
    // =========================
    const mentor = await Mentor.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (mentor) {
      role = "mentor";
      profilePic = mentor.photo || "";

      let isMatch = false;
      const dbPwd = mentor.password || "";

      if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
        isMatch = await bcrypt.compare(plainPwd, dbPwd);
      } else if (dbPwd === plainPwd) {
        mentor.password = await bcrypt.hash(plainPwd, 10);
        await mentor.save();
        isMatch = true;
      }

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
          permissions:
            mentor.permissions?.length > 0 ? mentor.permissions : ["dashboard"],
        },
      });
    }

    // =========================
    // 2️⃣ Admin Login
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

      const finalPermissions =
        admin.isSuperAdmin && (!admin.permissions || admin.permissions.length === 0)
          ? [
              "dashboard",
              "home",
              "courses",
              "admin",
              "mentor",
              "students",
              "payments",
              "feedbacks",
            ]
          : admin.permissions || [];

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
          permissions: finalPermissions,
        },
      });
    }

    // =========================
    // 3️⃣ Student Login
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

      if (dbPwd.startsWith("$2b$")) {
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
          permissions: ["dashboard", "courses"],
        },
      });
    }

    // =========================
    // 4️⃣ Normal User Login
    // =========================
    const user = await User.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (user) {
      const isMatch = await bcrypt.compare(plainPwd, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          userId: user.userId,
          email: user.email,
          role: user.role,
          isSuperAdmin: !!user.isSuperAdmin,
          profilePic: user.profilePic || "",
          permissions: user.permissions || [],
        },
      });
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// GET CURRENT LOGGED-IN USER (NEW)
// =========================
// =========================
// GET CURRENT LOGGED-IN USER (FIXED)
// =========================
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role || "user";

    if (!userId)
      return res.status(401).json({ message: "Unauthorized - missing user ID" });

    let foundUser = null;

    // Try the most likely collection first
    if (role === "admin") {
      foundUser =
        (await Admin.findById(userId).select("-password")) ||
        (await User.findById(userId).select("-password"));
    } else if (role === "mentor") {
      foundUser =
        (await Mentor.findById(userId).select("-password")) ||
        (await User.findById(userId).select("-password"));
    } else if (role === "student") {
      foundUser =
        (await Student.findById(userId).select("-password")) ||
        (await User.findById(userId).select("-password"));
    } else {
      foundUser = await User.findById(userId).select("-password");
    }

    // If no document found in any collection
    if (!foundUser)
      return res.status(404).json({ message: "User not found" });

    // SuperAdmin fallback — treat User with isSuperAdmin as admin
    const isSuperAdmin = !!foundUser.isSuperAdmin;
    const resolvedRole =
      isSuperAdmin || foundUser.role === "admin" ? "admin" : foundUser.role || role;

    res.json({
      id: foundUser._id,
      name:
        foundUser.name ||
        `${foundUser.firstName || ""} ${foundUser.lastName || ""}`.trim(),
      email: foundUser.email,
      role: resolvedRole,
      isSuperAdmin,
      profilePic: foundUser.photo || foundUser.profilePic || "",
      permissions: foundUser.permissions || [],
    });
  } catch (err) {
    console.error("Get current user error:", err);
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
