const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const { createRazorpayOrder, verifyRazorpaySignature } = require('../services/paymentService');

// Create new payment order
const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Create order on Razorpay (for Stripe, you'd create a session here)
    const order = await createRazorpayOrder(course.price, 'INR', `course_${courseId}`);

    // Save locally
    const payment = await Payment.create({
      user: req.user._id,
      course: course._id,
      provider: 'razorpay',
      providerPaymentId: order.id,
      amount: course.price,
      status: 'created'
    });

    res.json({ order, paymentId: payment._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Confirm payment & enroll student
const confirmPayment = async (req, res) => {
  try {
    const { paymentId, providerPaymentId, signature } = req.body;

    const payment = await Payment.findById(paymentId).populate('course');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Verify payment signature (for Razorpay)
    const isValid = await verifyRazorpaySignature({ providerPaymentId, signature });
    if (!isValid) return res.status(400).json({ message: 'Invalid signature' });

    // Update payment record
    payment.status = 'successful';
    payment.providerPaymentId = providerPaymentId;
    await payment.save();

    // Enroll user
    const user = await User.findById(payment.user);
    if (!user.enrolledCourses.includes(payment.course._id)) {
      user.enrolledCourses.push(payment.course._id);
      await user.save();
    }

    if (!payment.course.enrolledStudents.includes(user._id)) {
      payment.course.enrolledStudents.push(user._id);
      await payment.course.save();
    }

    res.json({ message: 'Payment confirmed and user enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, confirmPayment };
