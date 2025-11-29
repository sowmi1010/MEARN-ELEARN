const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    userId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },

    // 💰 Wallet / Balance
    balance: { type: Number, default: 0 },

    // Role & Permissions
    isSuperAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["student", "mentor", "admin", "user"],
      default: "student",
    },
    permissions: [{ type: String }],

    // For Students
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    // Profile
    profilePic: { type: String, default: "" },

    // Forgot Password
    resetPasswordCode: { type: String, default: "" },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving (only if needed)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password.startsWith("$2b$")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password.startsWith("$2b$")) {
    if (this.password === candidatePassword) {
      this.password = await bcrypt.hash(candidatePassword, 10);
      await this.save();
      return true;
    }
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields in output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordCode;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
