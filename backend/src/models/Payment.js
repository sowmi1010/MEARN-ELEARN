const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional real DB course (not used for group bundles)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    provider: {
      type: String,
      enum: ["razorpay", "stripe", "demo"],
      default: "demo",
    },

    providerPaymentId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "successful", "failed"],
      default: "successful",
    },

    // ✅ EXTENDED METADATA
    metadata: {
      title: { type: String },      // ROOT MONTHLY / PYTHON / TNPSC etc
      group: { type: String },      // root / stem / leaf / seed / flower

      // ✅ NEW FIELDS
      standard: { type: String },   // 4th / 5th / 10th
      board: { type: String },      // CBSE / Tamil Nadu
      language: { type: String },   // English / Tamil
      groupCode: { type: String },  // For Leaf only
      planType: { type: String },   // monthly / yearly
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
