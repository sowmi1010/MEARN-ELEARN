const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const User = require("../models/User");

/*
  ✅ PUBLIC users for chat only
*/
router.get("/public-users", async (req, res) => {
  try {
    const admins = await Admin.find().select("firstName lastName photo");
    const students = await Student.find().select("firstName lastName photo");
    const mentors = await Mentor.find().select("firstName lastName photo");
    const users = await User.find().select("name profilePic");

    const format = (arr, role) =>
      arr.map((u) => ({
        _id: u._id,
        firstName: u.firstName || u.name || "User",
        lastName: u.lastName || "",
        photo: u.photo || u.profilePic || "",
        role: role,
      }));

    const final = [
      ...format(admins, "admin"),
      ...format(students, "student"),
      ...format(mentors, "mentor"),
      ...format(users, "user"),
    ];

    res.json(final);
  } catch (err) {
    console.error("Public users error:", err.message);
    res.status(500).json({ message: "Error loading users" });
  }
});

module.exports = router;
