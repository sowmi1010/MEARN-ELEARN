// middlewares/auth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const User = require("../models/User");

/*
  MODEL PRIORITY ORDER
  Highest privilege first so admin docs found first
*/
const MODEL_ORDER = [
  { Model: Admin, role: "admin" },
  { Model: Mentor, role: "mentor" },
  { Model: Student, role: "student" },
  { Model: User, role: "user" },
];

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

    let found = null;
    for (const entry of MODEL_ORDER) {
      const doc = await entry.Model.findById(decoded.id).select("-password");
      if (doc) {
        found = { doc, role: entry.role, Model: entry.Model };
        break;
      }
    }

    if (!found) return res.status(404).json({ message: "User not found" });

    const { doc, role, Model } = found;

    // readable name
    const name = doc.name || `${doc.firstName || ""} ${doc.lastName || ""}`.trim();

    // final role adjustments
    let finalRole = role;
    if (role === "user" && doc.role === "admin") finalRole = "admin";
    if (doc.role === "admin") finalRole = "admin";
    if (doc.isSuperAdmin === true) finalRole = "admin"; // treat superadmin as admin in routes

    req.user = {
      _id: doc._id,
      id: doc._id.toString(),
      role: finalRole,
      name,
      email: doc.email,
      permissions: doc.permissions || [],
      enrolledCourses: doc.enrolledCourses || [],
      isSuperAdmin: doc.isSuperAdmin === true,
    };

    req.model = Model;
    req.userDoc = doc;

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
