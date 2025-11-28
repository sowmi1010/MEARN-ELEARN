const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all normal users (for ChatList)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("name email profilePic role");

    const formatted = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: "user",
      photo: u.profilePic || "",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("User all error:", error);
    res.status(500).json({ message: "Failed fetching users" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// ✅ PUBLIC USERS LIST (For Chat)
router.get("/public-list", async (req, res) => {
  try {
    const users = await User.find({}, "name role");

    const formatted = users.map((u) => ({
      _id: u._id,
      firstName: u.name,
      lastName: "",
      role: u.role,
      photo: "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Public user list error:", err);
    res.status(500).json({ message: "Failed" });
  }
});



module.exports = router;
