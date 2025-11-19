const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateCertificate = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.courseId;

    // check course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already created
    let existing = await Certificate.findOne({ student: studentId, course: courseId });
    if (existing) return res.json(existing);

    // Create folder
    const certDir = path.join(__dirname, "../../uploads/certificates");
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

    const fileName = `${Date.now()}_${studentId}_${courseId}.pdf`;
    const pdfPath = path.join(certDir, fileName);

    // Generate PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(28).fillColor("#000080").text("Certificate of Completion", {
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(20).fillColor("#333").text(`This is to certify that`, {
      align: "center",
    });

    doc.moveDown(1);
    doc.fontSize(26).fillColor("#000").text(req.user.name, {
      align: "center",
    });

    doc.moveDown(1);
    doc.fontSize(18).text(`has successfully completed the course`, {
      align: "center",
    });

    doc.moveDown(1);
    doc.fontSize(22).fillColor("#4b0082").text(course.title, {
      align: "center",
    });

    doc.moveDown(3);
    doc.fontSize(14).text(`Issued on: ${new Date().toLocaleDateString()}`, {
      align: "center",
    });

    doc.end();

    writeStream.on("finish", async () => {
      const cert = await Certificate.create({
        student: studentId,
        course: courseId,
        pdfPath: `uploads/certificates/${fileName}`,
      });

      res.json(cert);
    });
  } catch (err) {
    console.error("Certificate error:", err);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user.id })
      .populate("course", "title");

    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load certificates" });
  }
};
