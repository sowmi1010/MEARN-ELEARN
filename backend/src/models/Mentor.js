const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mentorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    blood: { type: String },
    handicap: { type: String },

    branchName: { type: String },
    branchNumber: { type: String },
    role: { type: String, default: "mentor" }, 

    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    altPhone: { type: String },

    department: { type: String },
    type: { type: String },
    qualification: { type: String },
    experience: { type: String },
    language: { type: String },
    skills: { type: String },

    salary: { type: Number },
    maritalStatus: { type: String, enum: ["Married", "Unmarried"] },

    address: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },

    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    photo: { type: String },

    // Mentor access permissions
    permissions: { type: [String], default: [] },

  },
  { timestamps: true }
);

// Hash password before save
mentorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
mentorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Mentor", mentorSchema);
