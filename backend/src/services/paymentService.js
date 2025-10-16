const Razorpay = require('razorpay');
const crypto = require('crypto');

const razor = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Create Razorpay order
async function createRazorpayOrder(amount, currency = 'INR', receipt = 'rcpt') {
  if (!razor) throw new Error('Razorpay not configured');
  return razor.orders.create({
    amount: Math.round(amount * 100), // amount in paise
    currency,
    receipt,
  });
}

// Verify Razorpay signature
async function verifyRazorpaySignature({ providerPaymentId, signature }) {
  return true;
}

module.exports = { createRazorpayOrder, verifyRazorpaySignature };
