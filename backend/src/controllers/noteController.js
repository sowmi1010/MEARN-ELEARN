const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");

//Add New Note
exports.addNote = async (req, res) => {
  try {
    const {
      group,
      standard,
      board,
      language,
      subject,
      lesson,
      category,
      title,
      description,
    } = req.body;

    if (
      !group ||
      !standard ||
      !board ||
      !language ||
      !subject ||
      !lesson ||
      !category ||
      !title
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Save only relative paths
    const thumbnail = req.files?.thumbnail?.[0]
      ? path.posix.join("uploads/thumbnails", req.files.thumbnail[0].filename)
      : null;

    const file = req.files?.file?.[0]
      ? path.posix.join("uploads/notes", req.files.file[0].filename)
      : null;

    if (!thumbnail || !file) {
      return res.status(400).json({ message: "Thumbnail and file are required" });
    }

    const newNote = await Note.create({
      group,
      standard,
      board,
      language,
      subject,
      lesson,
      category,
      title,
      description,
      thumbnail,
      file,
    });

    res.status(201).json({
      message: "Note added successfully",
      note: {
        ...newNote._doc,
        thumbnail: newNote.thumbnail.replace(/\\/g, "/"),
        file: newNote.file.replace(/\\/g, "/"),
      },
    });
  } catch (err) {
    console.error("addNote error:", err);
    res.status(500).json({ message: "Failed to add note", error: err.message });
  }
};

//Get All Notes
exports.getNotes = async (req, res) => {
  try {
    const { group, standard, board, language, subject, lesson, category, search } = req.query;

    const filter = {};

    // Basic filters
    if (group) filter.group = new RegExp(group, "i");
    if (standard) filter.standard = new RegExp(standard, "i");
    if (board) filter.board = new RegExp(board, "i");
    if (language) filter.language = new RegExp(language, "i");
    if (subject) filter.subject = new RegExp(subject, "i");
    if (lesson) filter.lesson = new RegExp(lesson, "i");
    if (category) filter.category = new RegExp(category, "i");

    // ✅ Global Search (title + description + subject + lesson)
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { lesson: new RegExp(search, "i") },
      ];
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });

    const formatted = notes.map((note) => ({
      ...note._doc,
      thumbnail: note.thumbnail?.replace(/\\/g, "/"),
      file: note.file?.replace(/\\/g, "/"),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getNotes error:", err);
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
};


// Get Note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean();
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.thumbnail = note.thumbnail?.replace(/\\/g, "/");
    note.file = note.file?.replace(/\\/g, "/");

    res.json(note);
  } catch (err) {
    console.error("getNoteById error:", err);
    res.status(500).json({ message: "Failed to fetch note", error: err.message });
  }
};

//Update Note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const updates = req.body;

    // Handle new thumbnail
    if (req.files?.thumbnail?.[0]) {
      const oldThumb = path.resolve(__dirname, "../../", note.thumbnail || "");
      if (note.thumbnail && fs.existsSync(oldThumb)) fs.unlinkSync(oldThumb);

      updates.thumbnail = path.posix.join("uploads/thumbnails", req.files.thumbnail[0].filename);
    }

    // Handle new file
    if (req.files?.file?.[0]) {
      const oldFile = path.resolve(__dirname, "../../", note.file || "");
      if (note.file && fs.existsSync(oldFile)) fs.unlinkSync(oldFile);

      updates.file = path.posix.join("uploads/notes", req.files.file[0].filename);
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json({
      message: "Note updated successfully",
      note: {
        ...updatedNote._doc,
        thumbnail: updatedNote.thumbnail?.replace(/\\/g, "/"),
        file: updatedNote.file?.replace(/\\/g, "/"),
      },
    });
  } catch (err) {
    console.error("updateNote error:", err);
    res.status(500).json({ message: "Failed to update note", error: err.message });
  }
};

//Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const thumbPath = path.resolve(__dirname, "../../", note.thumbnail || "");
    const filePath = path.resolve(__dirname, "../../", note.file || "");

    if (note.thumbnail && fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    if (note.file && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await note.deleteOne();

    res.json({ message: "🗑️ Note deleted successfully" });
  } catch (err) {
    console.error("deleteNote error:", err);
    res.status(500).json({ message: "Failed to delete note", error: err.message });
  }
};
