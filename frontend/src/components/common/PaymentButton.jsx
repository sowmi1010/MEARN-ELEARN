import React from "react";
import api from "../../utils/api";

export default function PaymentButton({ courseId, price }) {
  async function handlePayment() {
    try {
      // 1. Create order on backend
      const res = await api.post("/payments/create", { courseId });
      const { order, paymentId } = res.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "E-Learn Academy",
        description: "Course Purchase",
        order_id: order.id,
        handler: async function (response) {
          // 3. Confirm payment with backend
          await api.post("/payments/confirm", {
            paymentId,
            providerPaymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          alert("✅ Payment successful! You are now enrolled.");
          window.location.reload();
        },
        theme: { color: "#38bdf8" }, // Accent color
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("❌ Payment failed: " + err.message);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handlePayment}
        className="
          group relative w-full py-4 rounded-xl 
          bg-gradient-to-r from-accent to-blue-500 
          text-darkBg font-extrabold text-lg
          shadow-lg hover:shadow-2xl hover:scale-[1.03] 
          transition-all duration-300 overflow-hidden
        "
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          💳 Buy Course – ₹{price}
        </span>

        {/* Shiny animation overlay */}
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-500"></span>
      </button>

      {/* Secure Payment Note */}
      <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
        🔒 Secure Payment via Razorpay | 100% Safe
      </p>
    </div>
  );
}
