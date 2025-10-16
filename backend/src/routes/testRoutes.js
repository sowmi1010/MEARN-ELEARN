const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); 
const {
  addTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} = require("../controllers/testController");

// Ensure upload folders exist
const testDir = path.join(__dirname, "../../uploads/tests");
const thumbDir = path.join(__dirname, "../../uploads/thumbnails");
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, thumbDir);
    else cb(null, testDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });



// Add new test (Admin or Mentor with “tests” permission)
router.post(
  "/upload",
  auth,
  checkPermission("tests"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addTest
);

//  Get all tests (Everyone with valid token)
router.get("/", auth, getTests);

// Get single test by ID
router.get("/:id", auth, getTestById);

// Update test (Admin or Mentor with “tests” permission)
router.put(
  "/:id",
  auth,
  checkPermission("tests"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateTest
);

// Delete test (Admin or Mentor with “tests” permission)
router.delete("/:id", auth, checkPermission("tests"), deleteTest);

module.exports = router;
