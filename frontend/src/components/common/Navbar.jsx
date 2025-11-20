import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/mentor") ||
    location.pathname.startsWith("/teacher")
  ) {
    return null;
  }

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("user-login", syncUser);
    window.addEventListener("user-logout", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("user-logout", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-logout"));
    navigate("/login");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/auth/upload-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = { ...user, profilePic: res.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      alert("Failed to update profile picture");
    }
  };

  return (
    <nav
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-50
        bg-white/70 dark:bg-[#0b1120]/70 backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.12)]
        border-b border-white/20 dark:border-white/10 transition-all duration-300"
    >
      <div className="px-6 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png"
            className="w-11 h-11 rounded-full border border-white/30 dark:border-white/10 shadow-sm group-hover:scale-105 transition"
          />

          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide
            bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent
            ">
            LAST TRY ACADEMY
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center font-semibold text-[15px]">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/about">About</NavLink>

          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 transition font-semibold"
            >
              Logout
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Toggle Theme */}
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />

            <div
              className="w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-700
                peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:to-blue-500
                transition-all"
            ></div>

            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow
              bg-white dark:bg-gray-200 flex items-center justify-center
              text-[12px] peer-checked:translate-x-7 transition-all duration-300"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </label>

          {/* Profile */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Hi, <span className="text-orange-500 font-semibold">{user.name}</span>
              </p>

              <div
                onClick={() => fileInputRef.current.click()}
                className="w-10 h-10 rounded-full border-2 border-orange-500 overflow-hidden cursor-pointer
                shadow-md hover:scale-105 transition-all"
              >
                <img
                  src={`${BASE_URL}/${(user.profilePic || "default-avatar.png").replace(/^\/+/, "")}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {/* Mobile Menu */}
          <button
            className="md:hidden text-3xl text-gray-700 dark:text-gray-200"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="md:hidden flex flex-col bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-lg
          border-t border-white/20 dark:border-white/10 px-6 py-4 rounded-b-2xl space-y-2"
        >
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/courses" onClick={() => setOpen(false)}>Courses</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>

          {!user ? (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)}>Register</NavLink>
            </>
          ) : (
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="text-red-500 text-left mt-3 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}


/* 🎯 Beautiful NavLink Component */
function NavLink({ to, children, ...rest }) {
  return (
    <Link
      to={to}
      {...rest}
      className="relative block py-2 font-medium text-gray-700 dark:text-gray-300
      hover:text-orange-500 transition group"
    >
      {children}
      <span
        className="absolute left-0 -bottom-1 h-[2px] bg-orange-500
        w-0 group-hover:w-full transition-all duration-300"
      ></span>
    </Link>
  );
}
