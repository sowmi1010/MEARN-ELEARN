const Book = require("../models/Book");
const fs = require("fs");

/**
 * ==========================
 * ✅ Add New Book
 * ==========================
 */
exports.addBook = async (req, res) => {
  try {
    const { group, standard, board, language, title, subject, about } = req.body;

    // Required fields
    if (!group || !standard || !board || !language || !title) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Extract Uploaded Files
    const thumbnail = req.files?.thumbnail?.[0]?.filename
      ? "uploads/thumbnails/" + req.files.thumbnail[0].filename
      : null;

    const file = req.files?.file?.[0]?.filename
      ? "uploads/books/" + req.files.file[0].filename
      : null;

    // Check files
    if (!thumbnail || !file) {
      return res.status(400).json({
        message: "Both thumbnail and file are required",
      });
    }

    // Save to DB
    const newBook = await Book.create({
      group,
      standard,
      board,
      language,
      title,
      subject,
      about,
      thumbnail,
      file,
    });

    res.status(201).json({
      message: "✅ Book added successfully",
      book: newBook
    });

  } catch (err) {
    console.error("❌ addBook error:", err);
    res.status(500).json({
      message: "Failed to add book",
      error: err.message
    });
  }
};


/**
 * ==========================
 * 📋 Get All Books (with smart filtering)
 * ==========================
 */
exports.getBooks = async (req, res) => {
  try {
    const { group, standard, board, language, subject, category } = req.query;
    const filter = {};

    // ✅ Match filters case-insensitively
    if (group) filter.group = { $regex: new RegExp(`^${group}$`, "i") };
    if (standard) filter.standard = { $regex: new RegExp(`^${standard}$`, "i") };
    if (board) filter.board = { $regex: new RegExp(`^${board}$`, "i") };
    if (language) filter.language = { $regex: new RegExp(`^${language}$`, "i") };
    if (subject) filter.subject = { $regex: new RegExp(`^${subject}$`, "i") };

    // ⚠️ Ignore fake category like “books”, “videos” etc.
    if (category && !["books", "videos", "notes", "tests", "quizzes"].includes(category.toLowerCase())) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    console.log("📚 Book Filter:", filter);

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("❌ getBooks error:", err);
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

/**
 * ==========================
 * 🔍 Get Single Book
 * ==========================
 */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    console.error("❌ getBookById error:", err);
    res.status(500).json({ message: "Failed to fetch book", error: err.message });
  }
};

/**
 * ==========================
 * ✏️ Update Book
 * ==========================
 */
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const updates = req.body;

    if (req.files?.thumbnail?.[0]) {
      if (book.thumbnail && fs.existsSync(book.thumbnail)) fs.unlinkSync(book.thumbnail);
      updates.thumbnail = req.files.thumbnail[0].path;
    }

    if (req.files?.file?.[0]) {
      if (book.file && fs.existsSync(book.file)) fs.unlinkSync(book.file);
      updates.file = req.files.file[0].path;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "✏️ Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error("❌ updateBook error:", err);
    res.status(500).json({ message: "Failed to update book", error: err.message });
  }
};

/**
 * ==========================
 * 🗑️ Delete Book
 * ==========================
 */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.thumbnail && fs.existsSync(book.thumbnail)) fs.unlinkSync(book.thumbnail);
    if (book.file && fs.existsSync(book.file)) fs.unlinkSync(book.file);

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("deleteBook error:", err);
    res.status(500).json({ message: "Failed to delete book", error: err.message });
  }
};
