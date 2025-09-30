// backend/src/models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    // 🧑 Personal Info
    firstName: { type: String, required: true },
    lastName: { type: String },
    dob: { type: Date, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    blood: { type: String }, // e.g. A+, B-, O+
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
    role: { type: String }, // designation / role
    salary: { type: Number },
    qualification: { type: String },
    experience: { type: String }, // Fresher, 2 years, etc.
    type: { type: String }, // Full-time, Part-time, Contract
    language: { type: String },
    skills: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    // 🔑 Login Credentials
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password

    // 🖼️ Profile
    photo: { type: String }, // stored in uploads/admins/
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
