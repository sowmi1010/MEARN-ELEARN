const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const User = require("../models/User");

// 🔍 Get user from any collection by ID
exports.getAnyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user =
      (await Admin.findById(id).select("name firstName lastName photo email")) ||
      (await Student.findById(id).select("firstName lastName photo email")) ||
      (await Mentor.findById(id).select("name photo email")) ||
      (await User.findById(id).select("name photo email"));

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
