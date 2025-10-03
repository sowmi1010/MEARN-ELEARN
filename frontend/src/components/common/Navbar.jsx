import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // 🌞 Default theme → light
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // 🌓 Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // 👤 Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Hide navbar on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // 📤 Profile upload
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
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to update profile picture");
    }
  };

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/80 dark:bg-darkCard/70
        backdrop-blur-lg shadow-md
        border-b border-gray-200 dark:border-gray-700
        transition-colors duration-300
      "
    >
      <div className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
        {/* 🔰 Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent cursor-pointer tracking-wide"
        >
          E-Learn
        </h1>

        {/* 🖥 Desktop Links */}
        <div className="hidden md:flex gap-8 items-center font-medium">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          {user?.role === "student" && (
            <NavLink to="/my-courses">My Courses</NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* 🌗 Toggle Switch */}
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <div
              className="
                w-14 h-7 rounded-full
                bg-gray-300 dark:bg-gray-700
                peer-checked:bg-gradient-to-r peer-checked:from-accent peer-checked:to-blue-500
                transition-colors duration-300
              "
            ></div>
            <div
              className="
                absolute top-0.5 left-0.5 w-6 h-6
                bg-white rounded-full shadow
                flex items-center justify-center
                text-sm
                transition-transform duration-300
                peer-checked:translate-x-7
              "
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </label>

          {/* 👤 Avatar */}
          {user && (
            <div className="flex items-center gap-3">
              <p className="hidden md:block text-sm text-gray-600 dark:text-gray-300 font-medium">
                Hi,{" "}
                <span className="text-accent font-semibold">{user.name}</span>
              </p>
              <div
                onClick={() => fileInputRef.current.click()}
                className="
                  w-10 h-10 md:w-11 md:h-11
                  rounded-full border-2 border-accent
                  overflow-hidden shadow cursor-pointer
                  hover:scale-105 transition
                "
              >
                <img
                  src={
                    user.profilePic
                      ? `http://localhost:4000${user.profilePic}`
                      : "/default-avatar.png"
                  }
                  alt="Profile"
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

          {/* 📱 Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-accent text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-darkCard border-t border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/courses" onClick={() => setMenuOpen(false)}>
            Courses
          </NavLink>
          {user?.role === "student" && (
            <NavLink to="/my-courses" onClick={() => setMenuOpen(false)}>
              My Courses
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-semibold text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

/* 🔗 Reusable NavLink */
function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        relative font-medium
        text-gray-700 dark:text-gray-300
        hover:text-accent transition group
      "
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
