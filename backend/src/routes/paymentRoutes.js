const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const checkPermission = require('../middlewares/permission'); 
const role = require('../middlewares/role');
const {
  createOrder,
  confirmPayment,
} = require('../controllers/paymentController');
const Payment = require('../models/Payment');

// Student: create payment order
router.post('/create', auth, role('student'), createOrder);

// Student: confirm payment
router.post('/confirm', auth, role('student'), confirmPayment);

// Mentor (with "payments" permission) OR Admin: view all payments
router.get('/all', auth, checkPermission('payments'), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('course', 'title');
    res.json(payments);
  } catch (err) {
    console.error("Payment fetch error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

module.exports = router;
