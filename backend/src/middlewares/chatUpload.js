const multer = require("multer");
const path = require("path");
const fs = require("fs");

const basePath = "uploads/chat";

if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
if (!fs.existsSync(`${basePath}/images`))
  fs.mkdirSync(`${basePath}/images`, { recursive: true });
if (!fs.existsSync(`${basePath}/voices`))
  fs.mkdirSync(`${basePath}/voices`, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, `${basePath}/images`);
    } else if (file.mimetype.startsWith("audio")) {
      cb(null, `${basePath}/voices`);
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
  },
});

module.exports = multer({ storage });
