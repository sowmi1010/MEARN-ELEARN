import React from "react";
import api from "../utils/api";

export default function PaymentButton({ courseId, price }) {
  async function handlePayment() {
    try {
      // 1. Create order on backend
      const res = await api.post("/payments/create", { courseId });
      const { order, paymentId } = res.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // set in .env
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
          alert("Payment successful! You are now enrolled.");
          window.location.reload();
        },
        theme: { color: "#38bdf8" }, // Tailwind accent
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed: " + err.message);
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="w-full py-3 mt-4 rounded bg-accent text-darkBg font-semibold hover:opacity-90 transition"
    >
      Buy Course – ₹{price}
    </button>
  );
}
