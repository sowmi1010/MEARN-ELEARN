import React, { useState } from "react";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("Registered successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("Registration failed: " + msg);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-darkBg">
      <form
        onSubmit={handleRegister}
        className="bg-darkCard p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-accent mb-6">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-6 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded bg-accent text-darkBg font-semibold hover:opacity-90 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
