// src/pages/auth/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
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
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
