// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Theme Toggle
  useEffect(() => {
      console.log("ENV BASE URL →", BASE_URL); // ✅ ADD THIS LINE
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Load user and listen for login/logout changes
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    // Initial load
    syncUser();

    // Listen for all login/logout events across app
    window.addEventListener("storage", syncUser);
    window.addEventListener("user-login", syncUser);
    window.addEventListener("user-logout", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("user-logout", syncUser);
    };
  }, []);

  // Hide Navbar on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // Trigger instant logout update everywhere
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-darkCard/70 backdrop-blur-lg shadow-md border-b border-gray-200 dark:border-gray-700">
          {console.log("Navbar Rendered ✅")}

      <div className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent cursor-pointer"
        >
          LAST TRY ACADEMY
        </h1>

        <div className="hidden md:flex gap-8 items-center font-medium">
          <NavLink to="/">Home</NavLink>

          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-semibold"
            >
              Logout
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <div className="w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-700 peer-checked:bg-gradient-to-r peer-checked:from-accent peer-checked:to-blue-500"></div>
            <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-sm peer-checked:translate-x-7">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </label>

          {user && (
            <div className="flex items-center gap-3">
              <p className="hidden md:block text-sm text-gray-600 dark:text-gray-300 font-medium">
                Hi,{" "}
                <span className="text-accent font-semibold">{user.name}</span>
              </p>
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-accent overflow-hidden shadow cursor-pointer hover:scale-105"
              >
                <img
                  src={`${BASE_URL}/${(
                    user.profilePic || "default-avatar.png"
                  ).replace(/^\/+/, "")}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative font-medium text-gray-700 dark:text-gray-300 hover:text-accent group transition"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
