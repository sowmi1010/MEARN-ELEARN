const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // root | stem | leaf | flower | fruit | seed
    group: {
      type: String,
      enum: ["root", "stem", "leaf", "flower", "fruit", "seed"],
      required: true,
    },

    // Academic filters
    standard: String,     // 1st, 5th, 10th
    board: String,        // CBSE, Tamil Nadu
    language: String,     // Tamil, English
    groupCode: String,    // Leaf only (Bio-Maths etc)

    // Subscription pricing
    priceMonthly: { type: Number, default: 0 },
    priceYearly: { type: Number, default: 0 },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
