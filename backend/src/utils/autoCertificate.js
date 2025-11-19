const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function autoGenerateCertificate(studentId, courseId) {
  // If already exists → return
  let existing = await Certificate.findOne({ student: studentId, course: courseId });
  if (existing) return existing;

  const course = await Course.findById(courseId);
  if (!course) return null;

  const certDir = path.join(__dirname, "../../uploads/certificates");

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  const fileName = `${Date.now()}_${studentId}_${courseId}.pdf`;
  const pdfPath = path.join(certDir, fileName);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(pdfPath);

  doc.pipe(stream);

  doc.fontSize(28).text("Certificate of Completion", { align: "center" });

  doc.moveDown(2);
  doc.fontSize(18).text("This certifies that the student has completed:", {
    align: "center",
  });

  doc.moveDown(1);
  doc.fontSize(22).text(course.title, { align: "center" });

  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", async () => {
      const cert = await Certificate.create({
        student: studentId,
        course: courseId,
        pdfPath: `uploads/certificates/${fileName}`,
      });
      resolve(cert);
    });
  });
}

module.exports = autoGenerateCertificate;
