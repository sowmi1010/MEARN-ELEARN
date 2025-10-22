const express = require("express");
const { getAnyUser } = require("../controllers/userLookupController");
const protect = require("../middlewares/auth");

const router = express.Router();

router.get("/:id", protect, getAnyUser);

module.exports = router;
