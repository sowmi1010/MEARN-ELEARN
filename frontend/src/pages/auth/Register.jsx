import React, { useEffect, useState } from "react";
import api from "../../utils/api";

/**
 * Register Component
 * - Uses background: /mnt/data/Background Image.png
 * - Uses logo: /mnt/data/biglogo.png
 *
 * Copy/paste directly. Tailwind required.
 */

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
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Password strength checker
  const getStrength = (pwd) => {
    if (!pwd) return "";
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return "Weak";
    if (score === 2) return "Medium";
    return "Strong";
  };

  // tiny validation & register
  async function handleRegister(e) {
    e.preventDefault();
    let newErrors = {};
    if (!form.name) newErrors.name = "Enter full name";
    if (!form.userId) newErrors.userId = "Enter user id";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter valid email";
    if (!form.phone || !/^\d{7,15}$/.test(form.phone))
      newErrors.phone = "Enter valid phone number";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be 6+ characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.agree) newErrors.agree = "You must agree to continue.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      // use your api helper (same as your previous code)
      const res = await api.post("/auth/register", {
        name: form.name,
        userId: form.userId,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      alert("Registered successfully! Please log in to continue.");
      window.location.href = "/login";
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("Registration failed: " + msg);
    }
  }

  // small helper to update fields
  const onChange = (field, value) => {
    setForm((s) => ({ ...s, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div
      className=" w-full flex items-center justify-center relative overflow-hidden mt-16"
      style={{
        backgroundImage: `url('/Bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-live="polite"
    >
      <img
        src="/biglogo.png"
        alt="Last Try Academy"
        className=" rounded-full shadow-lg bg-white p-1 absolute top-4 left-10"
      />
      {/* star + comet overlays */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden>
        {/* small stars */}
        <div className="w-full h-full">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <radialGradient id="g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            {/* scatter some circles */}
            {Array.from({ length: 60 }).map((_, i) => {
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const a = 0.2 + Math.random() * 0.9;
              const r = 0.6 + Math.random() * 1.8;
              return (
                <circle
                  key={i}
                  cx={`${left}%`}
                  cy={`${top}%`}
                  r={r}
                  fill={`rgba(255,255,255,${0.06 + Math.random() * 0.2})`}
                />
              );
            })}
          </svg>
        </div>

        {/* animated comets (CSS below) */}
        <div className="comet comet-1" />
        <div className="comet comet-2" />
        <div className="comet comet-3" />
      </div>

      {/* Container: left hero + right form (stacked on sm screens) */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-6 py-12">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
            shake ? "animate-[shake_0.45s]" : ""
          }`}
        >
          {/* LEFT HERO PANEL */}
          <aside
            className="
  hidden        
  lg:flex          
  flex-col gap-6 justify-center items-center text-left text-white
  order-2 lg:order-1
"
          >
            <div className="bg-white/8 dark:bg-white/6 backdrop-blur-sm rounded-xl ml-10 px-6 py-6 max-w-md shadow-md border border-white/10">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                SIGN UP
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/90">
                Start your learning adventure with Last Try Academy. Join our
                mentorship program and build skills that matter.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                >
                  Sign in
                </button>
              </div>
            </div>

            <div className="mt-6 text-white/90 max-w-md">
              <h3 className="text-xl font-bold text-white">
                Sign up to your adventure!
              </h3>
              <p className="mt-3 text-sm">
                By registering you agree to our{" "}
                <span className="underline">Terms and Conditions</span>.
              </p>
            </div>
          </aside>

          {/* RIGHT FORM PANEL */}
          <section className="order-1 lg:order-2 flex justify-center">
            <form
              onSubmit={handleRegister}
              className="
  w-full max-w-md rounded-2xl p-6 sm:p-8 
  bg-white/8 dark:bg-white/6 backdrop-blur-sm  
  ml-0 sm:ml-0 md:ml-0 lg:ml-10 
  px-6 py-6 shadow-md border border-white/10 
  transition-all
"
            >
              {/* TITLE */}
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-white tracking-wider">
                  SIGN UP
                </h2>
              </div>

              {/* INPUTS */}
              <div className="space-y-5">
                {[
                  { label: "Name", field: "name", type: "text", icon: "👤" },
                  {
                    label: "User ID",
                    field: "userId",
                    type: "text",
                    icon: "🆔",
                  },
                  { label: "Email", field: "email", type: "email", icon: "✉️" },
                  {
                    label: "Phone Number",
                    field: "phone",
                    type: "tel",
                    icon: "📞",
                  },
                ].map(({ label, field, type, icon }) => (
                  <div key={field} className="relative">
                    {/* ICON */}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-lg">
                      {icon}
                    </span>

                    <input
                      type={type}
                      value={form[field]}
                      onChange={(e) => onChange(field, e.target.value)}
                      placeholder={label}
                      className="
              w-full py-3 pl-12 pr-4 rounded-lg
              bg-[#12072f]/80 
              text-white placeholder:text-white/50
              border border-white/10 
              focus:ring-2 focus:ring-cyan-400 
              outline-none transition
            "
                      autoComplete="off"
                    />

                    {errors[field] && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                {/* PASSWORD */}
                <div className="relative">
                  {/* ICON */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-lg">
                    🔒
                  </span>

                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    placeholder="Password"
                    className="
            w-full py-3 pl-12 pr-10 rounded-lg
            bg-[#12072f]/80 
            text-white placeholder:text-white/50
            border border-white/10 
            focus:ring-2 focus:ring-cyan-400
            outline-none transition
          "
                  />

                  {/* Eye toggle */}
                  <span
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 cursor-pointer text-lg"
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </span>

                  {/* Password strength */}
                  {form.password && (
                    <span
                      className={`
              mt-1 inline-block px-2 py-0.5 rounded text-xs text-white
              ${
                getStrength(form.password) === "Strong"
                  ? "bg-green-600"
                  : getStrength(form.password) === "Medium"
                  ? "bg-yellow-500"
                  : "bg-red-600"
              }
            `}
                    >
                      {getStrength(form.password)}
                    </span>
                  )}

                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative">
                  {/* ICON */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-lg">
                    🔒
                  </span>

                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      onChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm Password"
                    className="
            w-full py-3 pl-12 pr-10 rounded-lg
            bg-[#12072f]/80 
            text-white placeholder:text-white/50
            border border-white/10 
            focus:ring-2 focus:ring-cyan-400
            outline-none transition
          "
                  />

                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 cursor-pointer text-lg"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </span>

                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* AGREEMENT */}
                <label className="flex items-center gap-2 text-white/90 text-sm">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => onChange("agree", e.target.checked)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  <span>
                    I agree to all the{" "}
                    <span className="text-red-400 font-semibold">Terms</span>{" "}
                    and{" "}
                    <span className="text-red-400 font-semibold">
                      Privacy Policies
                    </span>
                  </span>
                </label>

                {errors.agree && (
                  <p className="text-xs text-red-400">{errors.agree}</p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="
        mt-8 w-full py-3 rounded-xl text-lg font-bold
        bg-gradient-to-r from-[#3aa0ff] to-[#9b2fff]
        text-white shadow-lg hover:scale-[1.03] transition
      "
              >
                Sign up
              </button>

              <p className="mt-4 text-center text-xs text-white/60">
                By registering you agree to our{" "}
                <span className="underline">Terms and Conditions</span>
              </p>
            </form>
          </section>
        </div>
      </main>

      {/* small CSS (comets + animations + shake) */}
      <style>{`
        /* shake keyframes reused if needed */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-[shake_0.45s] { animation: shake 0.45s ease; }

        /* comets */
        .comet {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          filter: blur(1px);
          background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.2));
          opacity: 0.9;
          transform: translate(-50%, -50%) rotate(30deg);
        }
        .comet-1 { left: 10%; top: 8%; animation: comet1 6s linear infinite; }
        .comet-2 { left: 80%; top: 25%; animation: comet2 7s linear infinite; }
        .comet-3 { left: 60%; top: 70%; animation: comet3 9s linear infinite; }

        @keyframes comet1 {
          0% { transform: translate(-200px, -200px) scale(1) rotate(20deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(1200px, 800px) scale(0.2) rotate(20deg); opacity: 0; }
        }
        @keyframes comet2 {
          0% { transform: translate(-300px, -100px) scale(1) rotate(10deg); opacity: 0; }
          8% { opacity: 1; }
          100% { transform: translate(1000px, 600px) scale(0.2) rotate(10deg); opacity: 0; }
        }
        @keyframes comet3 {
          0% { transform: translate(-100px, -200px) scale(1) rotate(-10deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translate(900px, 500px) scale(0.2) rotate(-10deg); opacity: 0; }
        }

        /* subtle glass focus style for inputs when dark */
        input:focus { box-shadow: 0 6px 24px rgba(6,95,100,0.08); }

        /* responsive tweaks */
        @media (max-width: 640px) {
          header { left: 12px; right: 12px; }
        }

        
      `}</style>
    </div>
  );
}
