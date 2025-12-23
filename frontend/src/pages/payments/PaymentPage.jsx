import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiCheckCircle, FiShield, FiLock } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

export default function PaymentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [course, setCourse] = useState(state || null);
  const [processing, setProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const isRealDbCourse = /^[a-fA-F0-9]{24}$/.test(courseId || "");

  // ✅ LOGIN CHECK
  useEffect(() => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
    }
  }, []);

  // ✅ Payment progress animation
  const payProgress = useMemo(() => {
    if (processing) return 70;
    return 40;
  }, [processing]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-[#050b18] p-8">
        <h1 className="text-3xl font-bold text-red-500">
          ⚠ Course Details Missing
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-300">
          Please go back and select the course again.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ✅ MAIN PAY FUNCTION
  const handlePay = async () => {
    try {
      setProcessing(true);

      await api.post(
        "/payments/demo-pay",
        {
          courseId: isRealDbCourse ? courseId : null,
          title: course.title,
          price: course.price,
          group: course.group || courseId,
          planType: course.title?.includes("YEARLY") ? "yearly" : "monthly",

          standard: course.standard || null,
          board: course.board || null,
          language: course.language || null,
          groupCode: course.groupCode || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Payment saved successfully!");
      navigate("/payment-success", { state: course });
    } catch (err) {
      console.error(err);
      toast.error("Payment Failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050b18] flex items-center justify-center px-4 py-12">
      {/* Floating blur blobs */}
      <div className="absolute top-20 left-10 w-60 h-60 bg-indigo-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-400/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-2xl bg-white/80 dark:bg-[#0d172b]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_25px_70px_rgba(15,23,42,0.4)]">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            Secure Payment
          </h1>

          <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 flex items-center justify-center gap-2">
            <FiShield /> 100% Safe & Secure Transaction
          </p>
        </div>

        {/* IMAGE + INFO */}
        <div className="flex flex-col items-center">
          <img
            src={course.img}
            className="w-32 md:w-40 mb-4 object-contain drop-shadow-xl"
          />

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {course.title}
          </h2>

          {/* Details */}
          {course.standard && (
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {course.standard} • {course.board} • {course.language}
            </p>
          )}

          {course.groupCode && (
            <p className="text-xs text-yellow-500 mt-1">{course.groupCode}</p>
          )}
        </div>

        {/* PRICE */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Amount
          </p>
          <h2 className="text-4xl font-extrabold text-green-500 mt-1">
            ₹ {course.price}
          </h2>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Checkout Progress</span>
            <span>{processing ? "Processing..." : "Ready to Pay"}</span>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${payProgress}%` }}
            />
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiLock className="text-green-500" /> Safe encryption
          </div>
          <div className="flex items-center gap-2">
            <BsStars className="text-yellow-400" /> Instant access
          </div>
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={processing}
          className={`mt-8 w-full py-4 rounded-2xl text-white text-lg font-bold shadow-xl transition-all duration-300
            ${
              processing
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.03] hover:shadow-2xl"
            }
          `}
        >
          {processing ? "Processing Payment..." : "Confirm & Pay"}
        </button>

        {/* SMALL NOTE */}
        <p className="mt-4 text-xs text-center text-gray-400">
          By continuing, you agree to Last Try Academy’s terms & policies.
        </p>
      </div>
    </div>
  );
}
