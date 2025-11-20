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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("user-login"));

      const { role, permissions = [], isSuperAdmin } = res.data.user;

      if (isSuperAdmin || role === "admin") navigate("/admin/dashboard");
      else if (role === "mentor") {
        if (permissions.includes("dashboard")) navigate("/admin/dashboard");
        else if (permissions.includes("payments")) navigate("/admin/payments");
        else navigate("/admin/dashboard");
      } else navigate("/");
    } catch (err) {
      let msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Incorrect email or password. Please try again!";

      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden mt-14"
      style={{
        backgroundImage: `url('/Bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* LOGO */}
      <img
        src="/biglogo.png"
        alt="LTA"
        className="absolute top-14 left-28  rounded-full p-1 bg-white shadow-xl"
      />

      {/* CARD */}
      <form
        onSubmit={handleLogin}
        className={`relative w-full max-w-md mx-4 p-8 rounded-3xl 
            backdrop-blur-md bg-white/10 border border-white/20 
            shadow-2xl transition-all duration-500 
            ${shake ? "animate-[shake_0.45s]" : "hover:scale-[1.01]"}`}
      >
        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide">
          LOGIN
        </h2>

        {/* EMAIL / USER ID */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-lg">
            ✉️
          </span>
          <input
            type="text"
            placeholder="Email or User ID"
            value={emailOrUserId}
            onChange={(e) => setEmailOrUserId(e.target.value)}
            className="w-full py-3 pl-12 pr-4 rounded-lg 
                bg-[#12072f]/70 text-white placeholder:text-white/50
                border border-white/10 focus:ring-2 focus:ring-cyan-400
                outline-none transition"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-lg">
            🔒
          </span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 pl-12 pr-10 rounded-lg 
                bg-[#12072f]/70 text-white placeholder:text-white/50
                border border-white/10 focus:ring-2 focus:ring-cyan-400
                outline-none transition"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/70"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 mb-4 text-sm font-medium">
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-lg font-bold
            bg-gradient-to-r from-[#3aa0ff] to-[#9b2fff]
            text-white shadow-lg hover:scale-[1.03] transition
            disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FiLoader className="animate-spin" /> Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-300 text-right mt-4 cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>

        {/* SIGNUP LINK */}
        <p className="text-center text-white/70 mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-300 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

        {/* ANIMATIONS */}
        <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
      `}</style>
      </form>
    </div>
  );
}
