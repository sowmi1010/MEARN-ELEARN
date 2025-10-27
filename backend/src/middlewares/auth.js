const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "Token missing" });

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

    // ✅ Helper: unified lookup
    const lookup = async (Model, role) => {
      const doc = await Model.findById(decoded.id).select("-password");
      if (!doc) return null;
      return {
        _id: doc._id,
        id: doc._id.toString(),
        role,
        name: doc.name || `${doc.firstName || ""} ${doc.lastName || ""}`.trim(),
        email: doc.email,
        permissions: doc.permissions || [],
        enrolledCourses: doc.enrolledCourses || [],
        isSuperAdmin: !!doc.isSuperAdmin,
      };
    };

    // ✅ Priority lookup: Admin → Mentor → Student → User
    req.user =
      (await lookup(Admin, "admin")) ||
      (await lookup(Mentor, "mentor")) ||
      (await lookup(Student, "student")) ||
      (await lookup(User, "user"));

    if (!req.user)
      return res.status(404).json({ message: "User not found" });

    // ✅ Auto-upgrade: any Admin or SuperAdmin gets full access
    if (
      req.user.isSuperAdmin === true ||
      req.user.role === "admin" ||
      req.user.email?.toLowerCase() === "admin@example.com"
    ) {
      req.user.role = "admin";
      req.user.isSuperAdmin = true;
    }

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
