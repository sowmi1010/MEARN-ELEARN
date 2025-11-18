const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    provider: {
      type: String,
      enum: ["razorpay", "stripe", "demo"],
      default: "demo",
    },

    providerPaymentId: { type: String, required: true },

    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "successful", "failed"],
      default: "successful",
    },

    metadata: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
