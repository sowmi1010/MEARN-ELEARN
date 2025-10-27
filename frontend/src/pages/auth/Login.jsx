import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertCircle, FiLoader } from "react-icons/fi";
import api from "../../utils/api";

export default function Login() {
  const [emailOrUserId, setEmailOrUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { emailOrUserId, password });

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("user-login"));

      // Role-based navigation
      const { role, permissions = [], isSuperAdmin } = res.data.user;

      if (isSuperAdmin || role === "admin") navigate("/admin/dashboard");
      else if (role === "mentor") {
        if (permissions.includes("dashboard")) navigate("/admin/dashboard");
        else if (permissions.includes("payments")) navigate("/admin/payments");
        else navigate("/admin/dashboard");
      } else navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);

      let msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Incorrect email or password. Please try again!";

      // Normalize message
      const message = msg.toLowerCase();

      if (message.includes("invalid credentials")) {
        // Try to guess based on what user entered
        if (!emailOrUserId.includes("@")) {
          msg = "⚠️ Invalid User ID. Please check and try again!";
        } else if (!emailOrUserId.includes(".")) {
          msg = "⚠️ Invalid email format. Please try again!";
        } else {
          msg = "❌ Incorrect email or password. Please try again!";
        }
      } else if (message.includes("user not found")) {
        msg = "⚠️ No account found with that email or ID.";
      } else if (message.includes("password")) {
        msg = "❌ Incorrect password. Please try again!";
      } else if (message.includes("missing")) {
        msg = "⚠️ Please fill in all fields.";
      }

      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-gray-100">
      <form
        onSubmit={handleLogin}
        className={`relative w-96 p-8 rounded-3xl backdrop-blur-md bg-white/10 shadow-2xl border border-white/20 transition-all duration-500 ${
          shake ? "animate-shake" : "hover:scale-[1.01]"
        }`}
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-400 mb-8">
          Login to Last Try Academy
        </h2>

        {/* Email / ID */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-300">
            Email or User ID
          </span>
          <input
            type="text"
            placeholder="Enter your email or ID"
            value={emailOrUserId}
            onChange={(e) => setEmailOrUserId(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-800/50 text-gray-100 
                       border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none
                       transition-all duration-300"
          />
        </label>

        {/* Password */}
        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-300">Password</span>
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-800/50 text-gray-100 
                         border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none
                         transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </label>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold 
                     hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 transition-all duration-300"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center gap-2 mt-5 text-red-400 text-sm font-medium animate-pulse">
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-400 text-right cursor-pointer mt-4 hover:underline"
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
