const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true }, // custom user ID
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    // ✅ add mentor role support
    role: { type: String, enum: ["student", "mentor", "admin"], default: "student" },

    profilePic: { type: String, default: "" },

    // for students
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    // ✅ for mentors: permissions to decide dashboard access
    permissions: [{ type: String }], // e.g. ["students", "payments"]
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
