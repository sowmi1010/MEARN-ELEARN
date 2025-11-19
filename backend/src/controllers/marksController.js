const Mark = require("../models/Mark");

exports.addMarks = async (req, res) => {
  try {
    const {
      studentId,
      group,
      standard,
      subject,
      testName,
      marksObtained,
      totalMarks
    } = req.body;

    const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);

    const mark = await Mark.create({
      studentId,
      group,
      standard,
      subject,
      testName,
      marksObtained,
      totalMarks,
      percentage,
    });

    res.status(201).json({ message: "Marks added successfully", mark });
  } catch (err) {
    res.status(500).json({ message: "Failed to add marks", error: err.message });
  }
};

exports.getStudentMarks = async (req, res) => {
  try {
    const studentId = req.user.id;

    const marks = await Mark.find({ studentId }).sort({ createdAt: -1 });

    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Failed to load marks", error: err.message });
  }
};

exports.deleteMarks = async (req, res) => {
  try {
    await Mark.findByIdAndDelete(req.params.id);
    res.json({ message: "Marks deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete marks" });
  }
};
