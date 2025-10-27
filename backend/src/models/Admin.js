const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    // Personal Info
    firstName: { type: String, required: true },
    lastName: { type: String },
    dob: { type: Date, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    blood: { type: String },
    handicap: { type: String, enum: ["Yes", "No"], default: "No" },

    // Location & Contact
    address: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    altPhone: { type: String },

    // Work Info
    branchName: { type: String },
    branchNo: { type: String },
    department: { type: String },
    role: { type: String, default: "admin" }, // default admin
    salary: { type: Number },
    qualification: { type: String },
    experience: { type: String },
    type: { type: String }, // Full-time / Part-time
    language: { type: String },
    skills: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    // Login Credentials
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile
    photo: { type: String },

    // ✅ Permission System
    isSuperAdmin: { type: Boolean, default: false },

    // Each admin has access to certain modules
    permissions: {
      type: [String],
      default: [
        "dashboard",
        "home",
        "courses",
        "mentor",
        "students",
        "payments",
      ],
    },
  },
  { timestamps: true }
);

// Clean up any old index
adminSchema.index({ username: 1 }, { unique: false });

// Hash password before saving (if changed)
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Admin", adminSchema);
