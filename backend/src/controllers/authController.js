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
      return res
        .status(400)
        .json({ message: "Email or User ID already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userId,
      email,
      phone,
      password: hashed,
      role: role || "student",
      isSuperAdmin: isSuperAdmin || false,
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
// ✅ COMMON LOGIN (Single Endpoint)
// =========================
exports.login = async (req, res) => {
  try {
    const { emailOrUserId, password } = req.body;
    if (!emailOrUserId || !password)
      return res.status(400).json({ message: "Missing credentials" });

    let account = null;
    let role = "student";
    let permissions = [];
    let profilePic = "";
    let enrolledCourses = [];
    let isSuperAdmin = false;

    // 🔹 Try User
// 🔹 Try User (Auto Repair Hash Version)
account = await User.findOne({
  $or: [
    { email: emailOrUserId.trim().toLowerCase() },
    { userId: emailOrUserId.trim() },
  ],
});

if (account) {
  console.log("✅ Found User:", {
    email: account.email,
    userId: account.userId,
    role: account.role,
  });

  role = account.role || "student";
  isSuperAdmin = !!account.isSuperAdmin;
  profilePic = account.profilePic || "";
  enrolledCourses = account.enrolledCourses || [];

  const inputPwd = password.trim();
  let dbPwd = account.password?.trim();
  console.log("🔑 Incoming password:", inputPwd);
  console.log("🔒 Stored hash:", dbPwd);

  let isMatch = false;

  try {
    // ⚠️ Detect invalid hash (too short, malformed, or non-bcrypt)
    if (!dbPwd.startsWith("$2b$") || dbPwd.length < 59) {
      console.warn("⚠️ Invalid hash detected — rehashing plain password...");
      account.password = await bcrypt.hash(inputPwd, 10);
      await account.save();
      dbPwd = account.password;
    }

    isMatch = await bcrypt.compare(inputPwd, dbPwd);

    // 🧩 Handle plaintext case if previous fix missed
    if (!isMatch && dbPwd === inputPwd) {
      console.log("⚠️ Plain password found — hashing now...");
      account.password = await bcrypt.hash(inputPwd, 10);
      await account.save();
      isMatch = true;
    }
  } catch (err) {
    console.error("❌ Password compare error:", err.message);
  }

  if (!isMatch) {
    console.warn(`❌ Password mismatch for ${account.email}`);
    return res.status(400).json({ message: "Invalid credentials" });
  }

  console.log("✅ Password verified successfully for:", account.email);

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
    // 🔹 Try Mentor
    if (!account) {
      const mentor = await Mentor.findOne({
        $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
      });
      if (mentor) {
        account = mentor;
        role = "mentor";
        profilePic = mentor.photo || "";
        permissions = normalizePermissions(mentor.permissions || []);

        // ✅ Password handling for mentors (plain + hashed)
        let isMatch = false;
        try {
          if (mentor.comparePassword) {
            isMatch = await mentor.comparePassword(password);
          }
          if (!isMatch && mentor.password === password) {
            isMatch = true;
          }
        } catch (err) {
          console.error("❌ Mentor password error:", err.message);
        }

        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: mentor._id, role }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.json({
          token,
          user: {
            id: mentor._id,
            name: mentor.name || `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim(),
            userId: mentor.userId,
            email: mentor.email,
            role,
            isSuperAdmin: false,
            profilePic,
            permissions,
          },
        });
      }
    }

    // 🔹 Try Admin
    if (!account) {
      const admin = await Admin.findOne({
        $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
      });
      if (admin) {
        account = admin;
        role = "admin";
        profilePic = admin.profilePic || "";
        permissions = admin.permissions || [];
        isSuperAdmin = !!admin.isSuperAdmin;
      }
    }

    // 🔹 Try Student
    if (!account) {
      const student = await Student.findOne({
        $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
      });

      if (student) {
        console.log("🔍 Student search result:", student);
        console.log("Incoming body:", req.body);

        account = student;
        role = "student";
        profilePic = student.photo || "";
        enrolledCourses = student.enrolledCourses || [];

        let isMatch = false;

        try {
          // 1️⃣ First check bcrypt (for already hashed)
          if (student.comparePassword) {
            isMatch = await student.comparePassword(password);
          }

          // 2️⃣ If bcrypt fails, check plain match
          if (!isMatch && student.password === password) {
            // ✅ Auto-hash the plain password so future logins work
            student.password = await bcrypt.hash(password, 10);
            await student.save();
            isMatch = true;
            console.log(`🟢 Auto-hashed old plain password for ${student.email}`);
          }
        } catch (err) {
          console.error("❌ Student password check error:", err.message);
        }

        // 3️⃣ If both fail, stop
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate token
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
    }

    // If still no account found
    if (!account)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Default password check (admin/user)
    const isMatch = account.comparePassword
      ? await account.comparePassword(password)
      : await bcrypt.compare(password, account.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ JWT Token
    const token = jwt.sign({ id: account._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: account._id,
        name: account.name || `${account.firstName || ""} ${account.lastName || ""}`.trim(),
        userId: account.userId,
        email: account.email,
        role,
        isSuperAdmin,
        profilePic,
        permissions,
        enrolledCourses,
      },
    });
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
