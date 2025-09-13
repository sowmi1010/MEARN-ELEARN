import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Save login info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      // ✅ Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true }); // 👈 students go to Home
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      alert("Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBg">
      <form
        onSubmit={handleLogin}
        className="bg-darkCard p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-accent mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-accent text-darkBg rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
