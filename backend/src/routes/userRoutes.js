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

module.exports = router;
