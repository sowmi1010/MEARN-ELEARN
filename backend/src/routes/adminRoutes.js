const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const User = require("../models/User"); // Login (super admin / students)
const Admin = require("../models/Admin"); // Branch admin full details
const Student = require("../models/Student"); // Student full profile

const router = express.Router();

// FIX: Ensure Upload Folders Exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir("uploads/admins");
ensureDir("uploads/students");

// MULTER CONFIG

// Admin photo
const adminStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/admins/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadAdmin = multer({ storage: adminStorage });

// Student photo
const studentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/students/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadStudent = multer({ storage: studentStorage });

// DETAILED ADMIN CRUD

// Create Admin
// Create Admin (Fixed)
router.post(
  "/detailed-admin",
  auth,
  role("admin"),
  uploadAdmin.single("photo"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        dob,
        age,
        gender,
        blood,
        handicap,
        maritalStatus,
        branchName,
        branchNo,
        department,
        role: jobRole,
        email,
        phone,
        altPhone,
        address,
        district,
        state,
        pincode,
        salary,
        qualification,
        experience,
        type,
        language,
        skills,
        userId,
        password,
      } = req.body;

      if (!firstName || !email || !phone || !userId || !password) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      // Check duplicates
      const existing = await Admin.findOne({ $or: [{ email }, { userId }] });
      if (existing)
        return res.status(400).json({ message: "Email or UserId already exists" });

      const hashed = await bcrypt.hash(password, 10);

      // Create Admin Profile
      const newAdmin = await Admin.create({
        firstName,
        lastName,
        dob,
        age,
        gender,
        blood,
        handicap,
        maritalStatus,
        branchName,
        branchNo,
        department,
        role: jobRole,
        email,
        phone,
        altPhone,
        address,
        district,
        state,
        pincode,
        salary,
        qualification,
        experience,
        type,
        language,
        skills,
        userId,
        password: hashed,
        photo: req.file ? `/uploads/admins/${req.file.filename}` : null,
      });

      // Create Login Account in User collection
      await User.create({
        name: `${firstName} ${lastName || ""}`.trim(),
        userId,
        email,
        phone,
        password: hashed,
        role: "admin",
      });

      res.json({ message: "Admin created successfully", admin: newAdmin });
    } catch (err) {
      console.error("Add Admin Error:", err);
      res.status(500).json({ message: "Failed to create admin", error: err.message });
    }
  }
);

// Get All Admins
router.get("/detailed-admins", auth, role("admin"), async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    console.error("Fetch Admins Error:", err.stack);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// Get One Admin
router.get("/detailed-admins/:id", auth, role("admin"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Fetch Admin Error:", err.stack);
    res.status(500).json({ message: "Failed to fetch admin" });
  }
});

// Update Admin
router.put(
  "/detailed-admins/:id",
  auth,
  role("admin"),
  uploadAdmin.single("photo"),
  async (req, res) => {
    try {
      const updates = { ...req.body };
      if (updates.password)
        updates.password = await bcrypt.hash(updates.password, 10);
      if (req.file) updates.photo = `/uploads/admins/${req.file.filename}`;

      const updated = await Admin.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      res.json({ message: "Admin updated", admin: updated });
    } catch (err) {
      console.error("Update Admin Error:", err.stack);
      res
        .status(500)
        .json({ message: "Failed to update admin", error: err.message });
    }
  }
);

// Delete Admin
router.delete("/detailed-admins/:id", auth, role("admin"), async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error("Delete Admin Error:", err.stack);
    res.status(500).json({ message: "Failed to delete admin" });
  }
});

// STUDENT CRUD

// Add Student
router.post(
  "/students",
  auth,
  role("admin"),
  uploadStudent.single("photo"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        dob,
        age,
        gender,
        blood,
        handicap,
        institutionName,
        standard,
        group,
        board,
        type,
        language,
        father,
        mother,
        fatherOccupation,
        motherOccupation,
        email,
        phone,
        altPhone,
        address,
        district,
        state,
        pincode,
        fees,
        userId,
        password,
      } = req.body;

      if (!firstName || !email || !userId || !password) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const exists = await Student.findOne({ $or: [{ email }, { userId }] });
      if (exists)
        return res.status(400).json({ message: "Email/UserId already in use" });

      const newStudent = await Student.create({
        firstName,
        lastName,
        dob,
        age,
        gender,
        blood,
        handicap,
        institutionName,
        standard,
        group,
        board,
        type,
        language,
        father,
        mother,
        fatherOccupation,
        motherOccupation,
        email,
        phone,
        altPhone,
        address,
        district,
        state,
        pincode,
        fees,
        userId,
        password,
        photo: req.file ? `/uploads/students/${req.file.filename}` : null,
      });

      const hashed = await bcrypt.hash(password, 10);
      await User.create({
        name: `${firstName} ${lastName || ""}`.trim(),
        userId,
        email,
        phone,
        password: hashed,
        role: "student",
      });

      res.json({ message: "Student added successfully", student: newStudent });
    } catch (err) {
      console.error("Add Student Error:", err.stack);
      res
        .status(500)
        .json({ message: "Failed to create student", error: err.message });
    }
  }
);

// Get All Students
router.get("/students", auth, role("admin"), async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Fetch Students Error:", err.stack);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Get One Student
router.get("/students/:id", auth, role("admin"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Fetch Student Error:", err.stack);
    res.status(500).json({ message: "Failed to fetch student" });
  }
});

// Update Student
router.put(
  "/students/:id",
  auth,
  role("admin"),
  uploadStudent.single("photo"),
  async (req, res) => {
    try {
      const updates = { ...req.body };
      if (updates.password)
        updates.password = await bcrypt.hash(updates.password, 10);
      if (req.file) updates.photo = `/uploads/students/${req.file.filename}`;

      const updated = await Student.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });

      await User.findOneAndUpdate(
        { userId: updated.userId },
        {
          name: `${updated.firstName} ${updated.lastName || ""}`.trim(),
          email: updated.email,
          phone: updated.phone,
          ...(req.body.password && { password: updates.password }),
        }
      );

      res.json({ message: "Student updated", student: updated });
    } catch (err) {
      console.error("Update Student Error:", err.stack);
      res
        .status(500)
        .json({ message: "Failed to update student", error: err.message });
    }
  }
);

// Delete Student
router.delete("/students/:id", auth, role("admin"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await User.findOneAndDelete({ userId: student.userId });
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Delete Student Error:", err.stack);
    res.status(500).json({ message: "Failed to delete student" });
  }
});


// ✅ PUBLIC ADMIN LIST (For Chat)
router.get("/public-list", async (req, res) => {
  try {
    const admins = await Admin.find({}, "firstName lastName photo email");

    const formatted = admins.map((a) => ({
      _id: a._id,
      firstName: a.firstName,
      lastName: a.lastName || "",
      email: a.email,
      photo: a.photo || "",
      role: "admin",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Public admin list error:", err);
    res.status(500).json({ message: "Failed to load admins" });
  }
});


module.exports = router;
