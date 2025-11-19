const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission");

const {
  addMarks,
  getStudentMarks,
  deleteMarks,
} = require("../controllers/marksController");

// Admin – add marks
router.post("/add", auth, checkPermission("marks"), addMarks);

// Student – view only own marks
router.get("/student", auth, getStudentMarks);

// Admin – delete marks
router.delete("/:id", auth, checkPermission("marks"), deleteMarks);

module.exports = router;
