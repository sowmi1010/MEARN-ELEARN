const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],

    // ✅ FIX: should store enrolled students (users)
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
