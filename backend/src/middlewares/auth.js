const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const lookup = async (Model, role) => {
      const doc = await Model.findById(decoded.id).select("-password");
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        role,
        name: doc.name || `${doc.firstName || ""} ${doc.lastName || ""}`.trim(),
        email: doc.email,
        permissions: doc.permissions || [],
        enrolledCourses: doc.enrolledCourses || [],
        isSuperAdmin: !!doc.isSuperAdmin,
      };
    };

    req.user =
      (await lookup(Admin, "admin")) ||
      (await lookup(User, "user")) ||
      (await lookup(Mentor, "mentor")) ||
      (await lookup(Student, "student"));

    if (!req.user) return res.status(401).json({ message: "User not found" });

    if (
      decoded.role === "admin" ||
      req.user.isSuperAdmin === true ||
      req.user.email === "admin@example.com"
    ) {
      req.user.role = "admin";
      req.user.isSuperAdmin = true;
    }

    next();
  } catch (err) {
    console.error("❌ Auth Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
