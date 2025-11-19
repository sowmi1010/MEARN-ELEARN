const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { generateCertificate, getMyCertificates } = require("../controllers/certificateController");

// Student fetches all certificates
router.get("/my", auth, getMyCertificates);

// Student generates certificate
router.post("/:courseId", auth, generateCertificate);

module.exports = router;
