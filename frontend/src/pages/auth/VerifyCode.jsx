// src/pages/auth/VerifyCode.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/verify-code", { email, code });
      alert(res.data.message);
      navigate("/reset-password", { state: { email, code } });
    } catch (err) {
      alert(err.response?.data?.message || "Invalid code");
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
          Verify Code
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          We sent a 6-digit code to <span className="font-semibold">{email}</span>.
          Enter it below to verify your identity.
        </p>

        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-center mt-4 text-sm text-accent cursor-pointer hover:underline"
        >
          Resend Code
        </p>
      </form>
    </div>
  );
}
