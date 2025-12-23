const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ OPTIONAL: for static group payments
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    provider: {
      type: String,
      enum: ["demo", "razorpay", "stripe"],
      default: "demo",
    },

    providerPaymentId: {
      type: String,
      default: () => `DEMO_${Date.now()}`,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["successful", "failed"],
      default: "successful",
    },

    metadata: {
      title: String,
      group: String,
      standard: String,
      board: String,
      language: String,
      groupCode: String,
      planType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
