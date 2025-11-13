import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [processing, setProcessing] = useState(false);

  const course = state; // coming from navigate(... {state})

  const handlePay = async () => {
    try {
      setProcessing(true);

      // ✅ If this is a dummy group course (root-monthly, flower-2, etc)
      if (!courseId.startsWith("c_")) {
        toast.success("✅ Payment Successful!");
        return navigate("/payment-success");
      }

      // ✅ If real DB course
      await api.post("/payments/demo-pay", { courseId });
      toast.success("✅ Payment Successful!");
      navigate("/payment-success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment Failed");
    } finally {
      setProcessing(false);
    }
  };

  if (!course)
    return (
      <div className="text-center p-10 text-red-500 font-bold">
        ⚠ Invalid Course
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Payment</h1>

      <div className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-2xl w-full max-w-lg text-center">
        <img src={course.img} className="w-52 mx-auto rounded-lg" />
        <h2 className="text-2xl font-bold mt-4">{course.title}</h2>
        <p className="text-xl text-green-500 font-bold mt-3">₹ {course.price}</p>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
        >
          {processing ? "Processing..." : "Pay Now ✅"}
        </button>
      </div>
    </div>
  );
}
