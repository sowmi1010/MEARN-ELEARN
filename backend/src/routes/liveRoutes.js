const express = require("express");
const router = express.Router();

const { getUpcomingLive } = require("../controllers/liveController");

// PUBLIC → student dashboard shows upcoming live without login
router.get("/upcoming", getUpcomingLive);

module.exports = router;
