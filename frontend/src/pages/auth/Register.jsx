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

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  // Password strength checker
  const getStrength = (pwd) => {
    if (!pwd) return "";
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return "Weak";
    if (score === 2) return "Medium";
    return "Strong";
  };

  async function handleRegister(e) {
    e.preventDefault();
    let newErrors = {};
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match!";
    if (!form.agree) newErrors.agree = "You must agree to continue.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        userId: form.userId,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      alert("Registered successfully! Please log in to continue.");
      window.location.href = "/login"; // redirect to login page
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("Registration failed: " + msg);
    }
  }

  return (
    <div
      className="
        flex justify-center items-center min-h-screen 
        bg-gray-100 dark:bg-darkBg transition-colors duration-300
      "
    >
      <form
        onSubmit={handleRegister}
        className={`
          w-96 p-8 rounded-2xl
          bg-white dark:bg-darkCard
          shadow-lg dark:shadow-xl
          border border-gray-200 dark:border-gray-700
          ${shake ? "animate-[shake_0.3s]" : ""}
        `}
      >
        <h2 className="text-3xl font-extrabold text-center text-accent mb-8">
          Create Your Account
        </h2>

        {[ 
          { label: "Full Name", type: "text", field: "name" },
          { label: "User ID", type: "text", field: "userId" },
          { label: "Email", type: "email", field: "email" },
          { label: "Phone Number", type: "tel", field: "phone" },
          { label: "Password", type: "password", field: "password" },
          { label: "Confirm Password", type: "password", field: "confirmPassword" },
        ].map(({ label, type, field }) => (
          <div className="mb-5 relative" key={field}>
            <input
              type={type}
              id={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="
                peer w-full px-4 pt-5 pb-2 rounded-lg 
                bg-gray-100 dark:bg-gray-800 
                text-gray-800 dark:text-gray-100
                border border-gray-300 dark:border-gray-600
                focus:ring-2 focus:ring-accent focus:border-accent
                outline-none transition-all duration-200
              "
              placeholder=" "
              required
            />
            <label
              htmlFor={field}
              className="
                absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm 
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-accent
                transition-all
              "
            >
              {label}
            </label>
            {field === "password" && (
              <span
                className={`absolute right-3 top-2 text-xs font-semibold ${
                  getStrength(form.password) === "Strong"
                    ? "text-green-500"
                    : getStrength(form.password) === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {getStrength(form.password)}
              </span>
            )}
            {errors[field] && (
              <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* Agree to Terms */}
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            className="accent-accent w-4 h-4 rounded focus:ring-2 focus:ring-accent"
          />
          I agree to the{" "}
          <span className="text-accent font-medium">Terms</span> &{" "}
          <span className="text-accent font-medium">Privacy Policy</span>
        </label>
        {errors.agree && (
          <p className="text-xs text-red-500 mb-2">{errors.agree}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full py-3 rounded-lg text-lg font-bold
            bg-gradient-to-r from-accent to-blue-500 text-darkBg
            hover:scale-[1.03] hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-accent
            transition-all duration-300
          "
        >
          Sign Up
        </button>

        <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-accent">
            Login
          </a>
        </p>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
