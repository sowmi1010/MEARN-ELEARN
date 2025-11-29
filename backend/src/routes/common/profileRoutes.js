const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

/* ============================================
   FILE UPLOAD CONFIG
============================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profile"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});
const upload = multer({ storage });

/* ============================================
   GET PROFILE  (SAFE + FULL DATA)
============================================ */
router.get("/", auth, async (req, res) => {
  try {
    const doc = req.userDoc;
    if (!doc) return res.status(404).json({ message: "Profile not found" });

    const data = doc.toObject();
    delete data.password;
    delete data.__v;

    data.role = doc.isSuperAdmin ? "superadmin" : req.user.role;

    return res.json(data);
  } catch (err) {
    console.log("PROFILE GET ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ============================================
   UPDATE PROFILE (ROLE-BASED EDITABLE FIELDS)
============================================ */
router.put("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const doc = req.userDoc;
    const Model = req.model;
    const role = doc.isSuperAdmin ? "superadmin" : req.user.role;

    if (!Model || !doc) {
      return res.status(400).json({ message: "Invalid user context" });
    }

    // ROLE-BASED FIELDS ALLOWED
    const editable = {
      superadmin: ["firstName", "lastName", "email", "phone", "name", "password"],
      admin: ["firstName", "lastName", "dob", "age", "gender", "blood", "handicap",
              "address","district","state","pincode","email","phone","altPhone",
              "branchName","branchNo","department","qualification","experience",
              "type","language","skills","maritalStatus","salary"],
      mentor: ["firstName","lastName","dob","age","gender","blood","handicap",
               "branchName","branchNumber","email","phone","altPhone",
               "department","qualification","experience","language","skills",
               "salary","maritalStatus","address","district","state","pincode"],
      student: ["firstName","lastName","dob","age","gender","blood","handicap",
                "institutionName","standard","group","board","type","language",
                "father","mother","fatherOccupation","motherOccupation",
                "email","phone","altPhone","address","district","state","pincode"],
      user: ["name", "email", "phone", "address", "password"]
    };

    const allowed = editable[role] || [];

    const update = {};

    // only update non-empty values AND allowed fields
    Object.keys(req.body).forEach((key) => {
      if (
        allowed.includes(key) &&
        req.body[key] !== "" &&
        req.body[key] !== null &&
        req.body[key] !== undefined
      ) {
        update[key] = req.body[key];
      }
    });

    // password hashing
    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }

    // photo upload
    if (req.file) {
      const filePath = `/uploads/profile/${req.file.filename}`;
      if (role === "user") update.profilePic = filePath;
      else update.photo = filePath;
    }

    // update in DB
    const updated = await Model.findByIdAndUpdate(
      doc._id,
      update,
      { new: true, runValidators: true }
    ).select("-password -__v");

    return res.json(updated);
  } catch (err) {
    console.log("PROFILE UPDATE ERROR:", err);
    return res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
