const Test = require("../models/Test");
const fs = require("fs");
const path = require("path");

// Add Test
exports.addTest = async (req, res) => {
  try {
    const { group, standard, board, language, subject, category, title } = req.body;

    if (!group || !standard || !board || !language || !subject || !category || !title) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const thumbnail = req.files?.thumbnail?.[0]
      ? path.join("uploads", "thumbnails", req.files.thumbnail[0].filename)
      : null;
    const file = req.files?.file?.[0]
      ? path.join("uploads", "tests", req.files.file[0].filename)
      : null;

    if (!thumbnail || !file) {
      return res.status(400).json({ message: "Thumbnail and file are required" });
    }

    const newTest = await Test.create({
      group,
      standard,
      board,
      language,
      subject,
      category,
      title,
      thumbnail,
      file,
    });

    res.status(201).json({
      message: "Test added successfully",
      test: {
        ...newTest._doc,
        thumbnail: newTest.thumbnail.replace(/\\/g, "/"),
        file: newTest.file.replace(/\\/g, "/"),
      },
    });
  } catch (err) {
    console.error("addTest error:", err);
    res.status(500).json({ message: "Failed to add test", error: err.message });
  }
};

// Get All Tests
exports.getTests = async (req, res) => {
  try {
    const { group, standard, board, language, subject, category } = req.query;
    const filter = {};

    if (group) filter.group = { $regex: new RegExp(group, "i") };
    if (standard) filter.standard = { $regex: new RegExp(standard, "i") };
    if (board) filter.board = { $regex: new RegExp(board, "i") };
    if (language) filter.language = { $regex: new RegExp(language, "i") };
    if (subject) filter.subject = { $regex: new RegExp(subject, "i") };
    if (category) filter.category = { $regex: new RegExp(category.trim(), "i") };

    const tests = await Test.find(filter).sort({ createdAt: -1 });

    const formatted = tests.map((test) => ({
      ...test._doc,
      thumbnail: test.thumbnail?.replace(/\\/g, "/"),
      file: test.file?.replace(/\\/g, "/"),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getTests error:", err);
    res.status(500).json({ message: "Failed to fetch tests", error: err.message });
  }
};

// Get Single Test
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).lean();
    if (!test) return res.status(404).json({ message: "Test not found" });

    test.thumbnail = test.thumbnail?.replace(/\\/g, "/");
    test.file = test.file?.replace(/\\/g, "/");

    res.json(test);
  } catch (err) {
    console.error("getTestById error:", err);
    res.status(500).json({ message: "Failed to fetch test", error: err.message });
  }
};

// Update Test
exports.updateTest = async (req, res) => {
  try {
    console.log("PUT /tests/:id", req.params.id);
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const updates = { ...req.body };

    // Handle new thumbnail upload safely
    if (req.files?.thumbnail?.[0]) {
      try {
        const oldThumbPath = path.join(__dirname, "../../", test.thumbnail || "");
        if (test.thumbnail && fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath);
          console.log("Old thumbnail deleted");
        }
      } catch (e) {
        console.warn("Skipped thumbnail delete:", e.message);
      }

      updates.thumbnail = path.join(
        "uploads",
        "thumbnails",
        req.files.thumbnail[0].filename
      );
    }

    // Handle new file upload safely
    if (req.files?.file?.[0]) {
      try {
        const oldFilePath = path.join(__dirname, "../../", test.file || "");
        if (test.file && fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("Old test file deleted");
        }
      } catch (e) {
        console.warn("Skipped test file delete:", e.message);
      }

      updates.file = path.join("uploads", "tests", req.files.file[0].filename);
    }

    const updatedTest = await Test.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedTest)
      return res.status(404).json({ message: "Failed to update test" });

    res.json({
      message: "Test updated successfully",
      test: {
        ...updatedTest._doc,
        thumbnail: updatedTest.thumbnail?.replace(/\\/g, "/"),
        file: updatedTest.file?.replace(/\\/g, "/"),
      },
    });
  } catch (err) {
    console.error("updateTest error:", err);
    res.status(500).json({
      message: "Failed to update test",
      error: err.message,
      stack: err.stack,
    });
  }
};

// Delete Test
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const thumbPath = path.join(__dirname, "../../", test.thumbnail || "");
    const filePath = path.join(__dirname, "../../", test.file || "");

    if (test.thumbnail && fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    if (test.file && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await test.deleteOne();

    res.json({ message: "Test deleted successfully" });
  } catch (err) {
    console.error("deleteTest error:", err);
    res.status(500).json({ message: "Failed to delete test", error: err.message });
  }
};
