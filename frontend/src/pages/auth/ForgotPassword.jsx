// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      alert(res.data.message);
      navigate("/verify-code", { state: { email } }); 
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-darkBg">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 bg-white dark:bg-darkCard rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-accent mb-6">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Enter your registered email address. We’ll send a 6-digit code to
          reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800
            border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
            focus:ring-2 focus:ring-accent outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent text-darkBg font-bold rounded-lg hover:scale-[1.02] transition-all"
        >
          {loading ? "Sending..." : "Send Code"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center mt-4 text-sm text-accent cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}
