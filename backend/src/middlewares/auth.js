const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");

/**
 * ✅ Auth middleware
 *  - Verifies JWT
 *  - Looks up account in all collections
 *  - Normalizes req.user with consistent fields:
 *      { id, role, isSuperAdmin, permissions, enrolledCourses, name, email }
 */
const auth = async (req, res, next) => {
  try {
    let token = null;

    // Accept header token: "Authorization: Bearer <token>"
    const header = req.headers.authorization || "";
    if (header.startsWith("Bearer ")) token = header.split(" ")[1];

    // Accept cookie token if present
    if (!token && req.cookies && req.cookies.token) token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // -----------------------
    // 1) Check User collection (Super Admin or normal site-student)
    // -----------------------
    let account = await User.findById(decoded.id).select("-password");

    // 2) Mentor
    if (!account) {
      const mentor = await Mentor.findById(decoded.id).select("-password");
      if (mentor) {
        req.user = {
          id: mentor._id.toString(),
          role: "mentor",
          isSuperAdmin: false,
          permissions: mentor.permissions || [],
          name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
          email: mentor.email,
          enrolledCourses: [],
        };
        return next();
      }
    }

    // 3) Branch Admin
    if (!account) {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (admin) {
        req.user = {
          id: admin._id.toString(),
          role: "admin",
          isSuperAdmin: false,
          permissions: [],
          name: `${admin.firstName} ${admin.lastName || ""}`.trim(),
          email: admin.email,
          enrolledCourses: [],
        };
        return next();
      }
    }

    // 4) Student (manually created)
    if (!account) {
      const student = await Student.findById(decoded.id).select("-password");
      if (student) {
        req.user = {
          id: student._id.toString(),
          role: "student",
          isSuperAdmin: false,
          name: `${student.firstName} ${student.lastName || ""}`.trim(),
          email: student.email,
          enrolledCourses: student.enrolledCourses || [],
        };
        return next();
      }
    }

    // 5) Not found anywhere
    if (!account) {
      return res.status(401).json({ message: "User not found for token" });
    }

    // 6) ✅ Found in User collection
    req.user = {
      id: account._id.toString(),
      role: account.role,                        // could be "admin" or "student"
      isSuperAdmin: account.role === "admin" && account.name?.toLowerCase().includes("super"),
      permissions: account.permissions || [],
      name: account.name,
      email: account.email,
      enrolledCourses: account.enrolledCourses || [],
    };

    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
