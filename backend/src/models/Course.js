const mongoose = require("mongoose");
const slugify = require("slugify"); // 👈 install this: npm i slugify

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    slug: { type: String, unique: true }, // ✅ unique slug
  },
  { timestamps: true }
);

// Middleware to auto-generate slug
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
