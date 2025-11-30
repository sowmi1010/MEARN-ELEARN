// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const { isValidEmail, isValidPassword } = require("../utils/validators");

// Email transporter (keep env vars configured)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || "").trim(),
  },
  tls: { rejectUnauthorized: false },
});

transporter.verify((err) => {
  if (err) console.error("Mail setup failed:", err.message);
  else console.log("✅ Mail server ready");
});

/* -----------------------
   Helper resolvers
   - resolveName: returns readable name
   - resolvePhoto: returns correct photo/profilePic
------------------------*/
function resolveName(u) {
  if (!u) return "User";
  const name = u.name || `${(u.firstName || "").trim()} ${(u.lastName || "").trim()}`.trim();
  return name || "User";
}
function resolvePhoto(u) {
  if (!u) return "";
  // keep mixed fields for backward compat: photo (mentor/student/admin) OR profilePic (user)
  return u.photo || u.profilePic || "";
}

/* =========================
   REGISTER
   ========================= */
exports.register = async (req, res) => {
  try {
    const { name, userId, email, phone, password, role, isSuperAdmin } = req.body;

    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (!isValidPassword(password))
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) return res.status(400).json({ message: "Email or User ID already exists" });

    const user = await User.create({
      name,
      userId,
      email,
      phone,
      password,
      role: role || "student",
      isSuperAdmin: !!isSuperAdmin,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: {
        id: user._id,
        name: resolveName(user),
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSuperAdmin: !!user.isSuperAdmin,
        profilePic: resolvePhoto(user),
        permissions: user.permissions || [],
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   LOGIN (Unified across collections)
   ========================= */
exports.login = async (req, res) => {
  try {
    const { emailOrUserId, password } = req.body;
    if (!emailOrUserId || !password) return res.status(400).json({ message: "Missing credentials" });

    const plainPwd = password.trim();
    let userDoc = null;
    let role = "user";

    // Order: Mentor -> Admin -> Student -> User (you previously used this order)
    userDoc = await Mentor.findOne({
      $or: [{ email: emailOrUserId.trim().toLowerCase() }, { userId: emailOrUserId.trim() }],
    });
    if (userDoc) role = "mentor";

    if (!userDoc) {
      userDoc = await Admin.findOne({
        $or: [{ email: emailOrUserId.trim().toLowerCase() }, { userId: emailOrUserId.trim() }],
      });
      if (userDoc) role = "admin";
    }

    if (!userDoc) {
      userDoc = await Student.findOne({
        $or: [{ email: emailOrUserId.trim().toLowerCase() }, { userId: emailOrUserId.trim() }],
      });
      if (userDoc) role = "student";
    }

    if (!userDoc) {
      userDoc = await User.findOne({
        $or: [{ email: emailOrUserId.trim().toLowerCase() }, { userId: emailOrUserId.trim() }],
      });
      if (userDoc) role = userDoc.role || "user";
    }

    if (!userDoc) return res.status(400).json({ message: "Invalid credentials" });

    // password validation (bcrypt or legacy plain)
    const dbPwd = userDoc.password || "";
    let isMatch = false;
    if (dbPwd.startsWith("$2b$") || dbPwd.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(plainPwd, dbPwd);
    } else if (dbPwd === plainPwd) {
      // persist hash for legacy plaintext
      userDoc.password = await bcrypt.hash(plainPwd, 10);
      await userDoc.save();
      isMatch = true;
    }

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userDoc._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Respond with unified user object (mixed photo/profilePic preserved)
    return res.json({
      token,
      user: {
        id: userDoc._id,
        name: resolveName(userDoc),
        email: userDoc.email,
        userId: userDoc.userId,
        role,
        isSuperAdmin: !!userDoc.isSuperAdmin,
        profilePic: resolvePhoto(userDoc), // frontend should check user.profilePic OR user.photo too if needed
        permissions: userDoc.permissions || ["dashboard"],
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   UPLOAD PROFILE (multer setup + handler)
   ========================= */
const uploadDir = path.join(__dirname, "../../uploads/profile");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const clean = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${clean}`);
  },
});
const upload = multer({ storage });

exports.uploadMiddleware = upload; // use in route: upload.single('profilePic')

exports.uploadProfile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/uploads/profile/${req.file.filename}`;
    const id = req.user?.id;
    const role = req.user?.role;

    if (!id) return res.status(401).json({ message: "Unauthorized" });

    let doc = null;

    // Superadmin stored in User model OR admin model previously — keep your prior behavior
    if (req.user?.isSuperAdmin) {
      doc = await User.findById(id);
      if (doc) doc.profilePic = imagePath;
    } else if (role === "admin") {
      doc = (await Admin.findById(id)) || (await User.findById(id));
      if (doc) {
        // Admin may use `photo` or `profilePic` earlier, update both for consistency
        doc.photo = imagePath;
        doc.profilePic = imagePath;
      }
    } else if (role === "mentor") {
      doc = await Mentor.findById(id);
      if (doc) doc.photo = imagePath;
    } else if (role === "student") {
      doc = await Student.findById(id);
      if (doc) doc.photo = imagePath;
    } else {
      doc = await User.findById(id);
      if (doc) doc.profilePic = imagePath;
    }

    if (!doc) return res.status(404).json({ message: "User not found" });

    await doc.save({ validateBeforeSave: false });

    return res.json({
      message: "Profile picture updated successfully",
      profilePic: resolvePhoto(doc),
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

/* =========================
   GET CURRENT USER
   - Uses req.user.id (from auth middleware)
   - Returns a unified user object preserving `photo` or `profilePic`
   ========================= */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized - missing user ID" });

    // Try each collection — prefer admin -> mentor -> student -> user
    let found =
      (await Admin.findById(userId).select("-password")) ||
      (await Mentor.findById(userId).select("-password")) ||
      (await Student.findById(userId).select("-password")) ||
      (await User.findById(userId).select("-password"));

    if (!found) return res.status(404).json({ message: "User not found" });

    const name = resolveName(found);
    const profilePic = resolvePhoto(found);
    let finalRole = "user";

    // Determine final role (we cannot rely on instanceof checks across mongoose models reliably in some setups)
    if (found.__t === "Admin" || found.role === "admin" || (found.isSuperAdmin && found.isSuperAdmin === true)) finalRole = "admin";
    else if (found.__t === "Mentor" || found.role === "mentor") finalRole = "mentor";
    else if (found.__t === "Student" || found.role === "student") finalRole = "student";
    else finalRole = found.role || "user";

    if (found.isSuperAdmin) finalRole = "superadmin";

    return res.json({
      id: found._id,
      userId: found.userId || "",
      name,
      email: found.email,
      phone: found.phone || "",
      role: finalRole,
      isSuperAdmin: !!found.isSuperAdmin,
      profilePic, // may be empty string
      permissions: found.permissions || [],
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   Forgot / Reset Password
   (kept your flows)
   ========================= */
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
