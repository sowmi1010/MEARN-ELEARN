import React, { useState } from "react";
import api from "../../utils/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    userId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  async function handleRegister(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match!");
    }
    if (!form.agree) {
      return alert("You must agree to the Terms and Privacy Policy.");
    }

    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        userId: form.userId,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
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
        <h2 className="text-2xl font-bold text-accent mb-6">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <input
          type="text"
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
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
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
          required
        />

        <label className="flex items-center text-sm text-gray-400 mb-4">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            className="mr-2"
          />
          I agree to all the <span className="text-red-400 ml-1">Terms</span> and{" "}
          <span className="text-red-400">Privacy Policies</span>
        </label>

        <button
          type="submit"
          className="w-full py-3 rounded bg-accent text-darkBg font-semibold hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
