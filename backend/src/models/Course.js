const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema(
  {
    // 📝 Basic Info
    title: { type: String, required: true },
    description: { type: String },

    // 📂 Category & Price
    category: { type: String, required: true },
    price: { type: Number, default: 0 },

    // 👩‍🏫 Teacher
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🎥 Videos linked to this course
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],

    // 👨‍🎓 Students enrolled in this course
    enrolledStudents: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],                // ✅ prevents null array issues
    },

    // 🌐 Slug for SEO-friendly URLs
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// ✅ Automatically generate a slug from the title
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
