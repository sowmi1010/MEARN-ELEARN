const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const { isValidEmail, isValidPassword } = require("../utils/validators");

// =========================
// ✅ Email Transporter
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
  if (err) console.error("❌ Mail setup failed:", err.message);
  else console.log("✅ Mail server ready");
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
// ✅ REGISTER (Fixed)
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

    // ❌ No manual hashing — User model handles hashing safely
    const user = await User.create({
      name,
      userId,
      email,
      phone,
      password, // plain text → auto-hash via pre("save")
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
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// ✅ LOGIN (Fixed)
// =========================
exports.login = async (req, res) => {
  try {
    const { emailOrUserId, password } = req.body;
    if (!emailOrUserId || !password)
      return res.status(400).json({ message: "Missing credentials" });

    let account = null;
    let role = "student";
    let profilePic = "";
    let permissions = [];
    let enrolledCourses = [];
    let isSuperAdmin = false;

    const plainPwd = password.trim();

    // =========================
    // 1️⃣ Try User
    // =========================
    console.log("🔍 Trying User collection for:", emailOrUserId.trim());
    account = await User.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (account) {
      console.log("✅ Found in User:", account.email);
      role = account.role || "student";
      isSuperAdmin = !!account.isSuperAdmin;
      profilePic = account.profilePic || "";
      enrolledCourses = account.enrolledCourses || [];

      const dbPwd = account.password || "";
      let isMatch = false;

      console.log("🔐 Password check for User:", account.email);
      console.log("   - DB password starts with $2b$:", dbPwd.startsWith("$2b$"));
      console.log("   - DB password length:", dbPwd.length);
      console.log("   - Plain input password length:", plainPwd.length);

      // ✅ Handle both plain and bcrypt cases
      try {
        if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
          // ✅ Normal hashed password
          console.log("   - Attempting bcrypt compare...");
          isMatch = await bcrypt.compare(plainPwd, dbPwd);
          console.log("   - Bcrypt compare result:", isMatch);
        } else if (dbPwd === plainPwd) {
          // ✅ Plain password stored — fix it
          console.log("⚠️ Plain password found — hashing now...");
          account.password = await bcrypt.hash(plainPwd, 10);
          await account.save();
          isMatch = true;
        } else {
          // ❌ Double hash or corrupted case — rehash manually
          console.log("🧹 Fixing double-hash password for:", account.email);
          const newHash = await bcrypt.hash(plainPwd, 10);
          account.password = newHash;
          await account.save();
          isMatch = true;
        }
      } catch (err) {
        console.error("❌ Password check error:", err.message);
      }

      console.log("   - Final isMatch:", isMatch);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: account._id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          id: account._id,
          name: account.name,
          userId: account.userId,
          email: account.email,
          role,
          isSuperAdmin,
          profilePic,
          enrolledCourses,
        },
      });
    }

    // =========================
    // 2️⃣ Try Student
    // =========================
    console.log("🔍 Trying Student collection for:", emailOrUserId.trim());
    const student = await Student.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (student) {
      role = "student";
      profilePic = student.photo || "";
      enrolledCourses = student.enrolledCourses || [];

      const dbPwd = student.password || "";
      let isMatch = false;

      try {
        if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
          // ✅ Normal hashed password
          isMatch = await bcrypt.compare(plainPwd, dbPwd);
        } else if (dbPwd === plainPwd) {
          // ✅ Plain password stored — fix it
          console.log("⚠️ Plain password found — hashing now...");
          student.password = await bcrypt.hash(plainPwd, 10);
          await student.save();
          isMatch = true;
        } else {
          // ❌ Double hash or corrupted case — rehash manually
          console.log("🧹 Fixing double-hash password for:", student.email);
          const newHash = await bcrypt.hash(plainPwd, 10);
          student.password = newHash;
          await student.save();
          isMatch = true;
        }
      } catch (err) {
        console.error("❌ Password check error:", err.message);
      }

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

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
          enrolledCourses,
        },
      });
    }


    // =========================
    // 3️⃣ Try Mentor
    // =========================
    console.log("🔍 Trying Mentor collection for:", emailOrUserId.trim());
    const mentor = await Mentor.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (mentor) {
      console.log("✅ Found in Mentor:", mentor.email);
      role = "mentor";
      profilePic = mentor.photo || "";
      permissions = normalizePermissions(mentor.permissions || []);

      const dbPwd = mentor.password || "";
      let isMatch = false;

      try {
        if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
          // ✅ Normal hashed password
          isMatch = await bcrypt.compare(plainPwd, dbPwd);
        } else if (dbPwd === plainPwd) {
          // ✅ Plain password stored — fix it
          console.log("⚠️ Plain password found — hashing now...");
          mentor.password = await bcrypt.hash(plainPwd, 10);
          await mentor.save();
          isMatch = true;
        } else {
          // ❌ Double hash or corrupted case — rehash manually
          console.log("🧹 Fixing double-hash password for:", mentor.email);
          const newHash = await bcrypt.hash(plainPwd, 10);
          mentor.password = newHash;
          await mentor.save();
          isMatch = true;
        }
      } catch (err) {
        console.error("❌ Password check error:", err.message);
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
          permissions,
        },
      });
    }

    // =========================
    // 4️⃣ Try Admin
    // =========================
    console.log("🔍 Trying Admin collection for:", emailOrUserId.trim());
    const admin = await Admin.findOne({
      $or: [
        { email: emailOrUserId.trim().toLowerCase() },
        { userId: emailOrUserId.trim() },
      ],
    });

    if (admin) {
      console.log("✅ Found in Admin:", admin.email);
      role = "admin";
      isSuperAdmin = !!admin.isSuperAdmin;
      profilePic = admin.photo || "";

      const dbPwd = admin.password || "";
      let isMatch = false;

      try {
        if (dbPwd.startsWith("$2b$") && dbPwd.length === 60) {
          // ✅ Normal hashed password
          isMatch = await bcrypt.compare(plainPwd, dbPwd);
        } else if (dbPwd === plainPwd) {
          // ✅ Plain password stored — fix it
          console.log("⚠️ Plain password found — hashing now...");
          admin.password = await bcrypt.hash(plainPwd, 10);
          await admin.save();
          isMatch = true;
        } else {
          // ❌ Double hash or corrupted case — rehash manually
          console.log("🧹 Fixing double-hash password for:", admin.email);
          const newHash = await bcrypt.hash(plainPwd, 10);
          admin.password = newHash;
          await admin.save();
          isMatch = true;
        }
      } catch (err) {
        console.error("❌ Password check error:", err.message);
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
        },
      });
    }

    // ❌ No account found
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("❌ Login error:", err);
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
      subject: "🔑 Password Reset Code",
      html: `<h2>Your Reset Code</h2><p><b>${code}</b></p><p>Valid for 10 minutes.</p>`,
    });

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
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

    res.json({ message: "✅ Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
