const Live = require("../models/Live");

// 🔹 Get upcoming live classes
exports.getUpcomingLive = async (req, res) => {
  try {
    const now = new Date();

    const upcoming = await Live.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(10);

    res.json(upcoming);
  } catch (err) {
    console.error("Upcoming live fetch error:", err);
    res.status(500).json({ message: "Failed to load live classes" });
  }
};
