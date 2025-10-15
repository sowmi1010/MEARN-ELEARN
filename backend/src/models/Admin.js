// backend/src/models/Admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    // 🧑 Personal Info
    firstName: { type: String, required: true },
    lastName: { type: String },
    dob: { type: Date, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    blood: { type: String },
    handicap: { type: String, enum: ["Yes", "No"], default: "No" },

    // 📍 Location & Contact
    address: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    altPhone: { type: String },

    // 💼 Work Info
    branchName: { type: String },
    branchNo: { type: String },
    department: { type: String },
    role: { type: String }, // e.g., Branch Manager
    salary: { type: Number },
    qualification: { type: String },
    experience: { type: String }, // e.g., "2 years", "Fresher"
    type: { type: String }, // Full-time / Part-time
    language: { type: String },
    skills: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    // 🔑 Login Credentials
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // will be auto-hashed

    // 🖼️ Profile
    photo: { type: String },

    // ⚙️ Permissions / Flags
    isSuperAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🧹 Clean up any old unique index that used to exist on "username"
adminSchema.index({ username: 1 }, { unique: false });

/* ======================================
   🔒 Auto-hash password before saving
====================================== */
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if unchanged
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ======================================
   🔑 Compare entered password with hash
====================================== */
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
