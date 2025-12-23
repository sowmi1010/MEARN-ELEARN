const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const enrollmentController = require("../controllers/enrollmentController");

// Create enrollment (after payment success)
router.post("/", auth, enrollmentController.createEnrollment);

// Get logged-in student's active enrollments
router.get("/my", auth, enrollmentController.myEnrollments);

module.exports = router;
