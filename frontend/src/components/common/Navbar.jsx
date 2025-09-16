import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      console.error("❌ Upload error:", err);
      alert("Failed to update profile picture");
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-darkCard/70 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-accent tracking-wide cursor-pointer">
        E-Learn
      </h1>

      {/* Links */}
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
          <div className="relative group">
            {/* Avatar */}
            <div
              className="relative w-12 h-12 cursor-pointer border-2 border-accent rounded-full overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {user.profilePic ? (
                <img
                  src={`http://localhost:4000${user.profilePic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/default-avatar.png"
                  alt="Default Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Dropdown */}
            <div className="absolute right-0 mt-3 w-48 bg-darkCard rounded-xl shadow-xl hidden group-hover:block transition">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-gray-300">Hi,</p>
                <p className="text-accent font-semibold">{user.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 rounded-b-xl transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-accent text-2xl"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-darkCard rounded-xl shadow-lg p-6 flex flex-col gap-4 md:hidden">
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
              className="text-red-400 hover:underline"
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
      className="relative text-gray-300 hover:text-accent font-medium transition"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-accent transition-all duration-300 hover:w-full"></span>
    </Link>
  );
}
