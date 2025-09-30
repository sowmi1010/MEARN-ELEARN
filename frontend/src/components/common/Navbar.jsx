import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ added useLocation
import api from "../../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();                // ✅ to check current route
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Hide Navbar on all admin routes
  if (location.pathname.startsWith("/admin")) {
    return null; // 🚫 Hide Navbar on admin/mentor dashboard pages
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  async function handleFileChange(e) {
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
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-darkCard/80 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-extrabold text-accent tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          E-Learn
        </h1>

        {/* Links (Desktop) */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          {user?.role === "student" && <NavLink to="/my-courses">My Courses</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Right Section: Welcome + Avatar */}
        {user && (
          <div className="flex items-center gap-3">
            <p className="hidden md:block text-sm text-gray-300 font-medium">
              Welcome, <span className="text-accent font-semibold">{user.name}</span>
            </p>
            <div
              className="w-12 h-12 cursor-pointer border-2 border-accent rounded-full overflow-hidden shadow hover:scale-105 transition"
              onClick={() => fileInputRef.current.click()}
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
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-accent text-2xl ml-4"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-darkCard border-t border-gray-700 p-6 flex flex-col gap-4">
          {user && (
            <p className="text-sm text-gray-300 mb-2">
              Welcome, <span className="text-accent font-semibold">{user.name}</span>
            </p>
          )}
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
          {user?.role === "student" && (
            <NavLink to="/my-courses" onClick={() => setMenuOpen(false)}>My Courses</NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 font-semibold text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

/* ✅ Reusable Link with underline animation */
function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative text-gray-300 hover:text-accent font-medium transition group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
