const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  provider: { type: String, enum: ['razorpay', 'stripe'], required: true },
  providerPaymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'successful', 'failed'], default: 'created' },
  metadata: Object,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
