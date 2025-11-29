const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");

/*
  MODEL PRIORITY ORDER
  So we always check from highest privilege → lowest.
*/
const MODEL_ORDER = [
  { Model: Admin, role: "admin" },
  { Model: Mentor, role: "mentor" },
  { Model: Student, role: "student" },
  { Model: User, role: "user" },
];

module.exports = async (req, res, next) => {
  try {
    // Read JWT token
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attempt lookup in all models
    let found = null;

    for (const entry of MODEL_ORDER) {
      const { Model, role } = entry;

      const doc = await Model.findById(decoded.id).select("-password");
      if (doc) {
        found = { doc, role, Model };
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ message: "User not found" });
    }

    const { doc, role, Model } = found;

    // Build readable name
    const name =
      doc.name ||
      `${doc.firstName || ""} ${doc.lastName || ""}`.trim();

    // -------------------------------------------------------
    // 🔥 FINAL ROLE — FIXED FOR ALL COLLECTIONS
    // -------------------------------------------------------
    let finalRole = role; // detected role from collection

    // If stored in User model BUT marked admin → treat as admin
    if (role === "user" && doc.role === "admin") {
      finalRole = "admin";
    }

    // If admin document has its own role field
    if (doc.role === "admin") {
      finalRole = "admin";
    }

    // SuperAdmin override
    if (doc.isSuperAdmin === true) {
      finalRole = "admin";
    }

    // -------------------------------------------------------
    // 🔥 BUILD req.user OBJECT
    // -------------------------------------------------------
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

    // These help later (profileRoutes)
    req.model = Model; // model used
    req.userDoc = doc; // raw DB doc

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
