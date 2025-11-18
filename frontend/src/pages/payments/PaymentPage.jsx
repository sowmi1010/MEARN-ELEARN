import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [course, setCourse] = useState(state || null);
  const [processing, setProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // -----------------------------------------
  // ✅ 1. LOGIN CHECK
  // -----------------------------------------
  useEffect(() => {
    if (!user) {
      toast.error("Please login to enroll");
      return navigate("/login");
    }
  }, []);

  // -----------------------------------------
  // ⚠ If user reloads Payment Page (state becomes null)
  // -----------------------------------------
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-500">⚠ Course Details Missing</h1>
        <p className="mt-3 text-gray-500">Please go back and select the course again.</p>

        <button
          onClick={() => navigate(-1)}
          className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // -----------------------------------------
  // ✅ 2. PAYMENT FUNCTION
  // -----------------------------------------
  const handlePay = async () => {
    try {
      setProcessing(true);

      // 🔥 For NON-database courses (root, stem, leaf, flower, seed)
      if (!courseId.startsWith("c_")) {
        toast.success("Payment Successful!");
        return navigate("/payment-success");
      }

      // 🔥 For REAL database courses
      await api.post("/payments/demo-pay", { courseId });

      toast.success("Payment Successful!");
      navigate("/payment-success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment Failed");
    } finally {
      setProcessing(false);
    }
  };

  // -----------------------------------------
  // ✅ PAYMENT UI
  // -----------------------------------------
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
