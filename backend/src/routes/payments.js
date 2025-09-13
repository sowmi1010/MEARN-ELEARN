const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  createOrder,
  confirmPayment,
} = require('../controllers/paymentController');
const Payment = require('../models/Payment');

// Student: create payment order
router.post('/create', auth, createOrder);

// Student: confirm payment
router.post('/confirm', auth, confirmPayment);

// Admin: get all payments
router.get('/all', auth, role('admin'), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('course', 'title');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
