const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    // Personal Info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    dob: { type: Date, required: true },
    age: { type: Number, min: 3, max: 100 },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    blood: { type: String, trim: true },
    handicap: { type: String, trim: true },

    // Academic Info
    institutionName: { type: String, trim: true },
    standard: { type: String, trim: true },
    group: { type: String, trim: true },
    board: { type: String, trim: true },
    type: { type: String, trim: true }, // Full-time / Part-time
    language: { type: String, trim: true },

    // Parent Info
    father: { type: String, trim: true },
    mother: { type: String, trim: true },
    fatherOccupation: { type: String, trim: true },
    motherOccupation: { type: String, trim: true },

    // Contact Info
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    altPhone: { type: String },

    // Address Info
    address: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },

    // System Info
    fees: { type: Number, default: 0 },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // will be hashed
    photo: { type: String }, // path to uploaded photo
  },
  { timestamps: true }
);


 // Middleware to hash password before saving

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//  Helper method to compare password

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
