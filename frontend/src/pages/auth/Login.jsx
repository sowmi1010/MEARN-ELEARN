import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function Login() {
  const [emailOrUserId, setEmailOrUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { emailOrUserId, password });

      // ✅ Save login data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ 🚀 Trigger instant Navbar & App update (NO refresh needed)
      window.dispatchEvent(new Event("user-login"));

      const { role, permissions = [], isSuperAdmin } = res.data.user;

      // ✅ Redirect by role
      if (isSuperAdmin || role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "mentor") {
        if (permissions.includes("dashboard"))
          navigate("/admin/dashboard", { replace: true });
        else if (permissions.includes("payments"))
          navigate("/admin/payments", { replace: true });
        else navigate("/admin/dashboard", { replace: true });
      } else {
        // Students / Users
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="w-96 p-8 rounded-2xl bg-white dark:bg-darkCard shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-extrabold text-center text-accent mb-8">
          🔐 Login to Last Try Academy
        </h2>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email or User ID
          </span>
          <input
            type="text"
            placeholder="Enter your email or ID"
            value={emailOrUserId}
            onChange={(e) => setEmailOrUserId(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent outline-none"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </span>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-accent text-darkBg font-bold hover:opacity-90 hover:scale-[1.02] shadow-md transition-all duration-300"
        >
          Login
        </button>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-accent text-right cursor-pointer mt-3 hover:underline"
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
