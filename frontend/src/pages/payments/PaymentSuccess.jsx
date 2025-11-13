import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const { state } = useLocation(); // title, price

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-green-500 mb-4">
        ✅ Payment Successful!
      </h1>

      {state?.title && (
        <p className="text-xl font-semibold mb-2">
          You enrolled in: <span className="text-blue-600">{state.title}</span>
        </p>
      )}

      <p className="text-lg mb-6">Your course is now activated.</p>

      <div className="flex gap-4">
        <Link
          to="/mycourses"
          className="px-6 py-3 bg-cyan-600 text-white rounded-xl text-lg font-semibold hover:bg-cyan-700 transition"
        >
          Go To My Courses
        </Link>

        <Link
          to="/"
          className="px-6 py-3 bg-gray-500 text-white rounded-xl text-lg font-semibold hover:bg-gray-600 transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
