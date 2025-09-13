import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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

  // ✅ Handle profile picture upload
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
    <nav className="bg-darkCard px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-accent">E-Learn</h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-accent transition">
          Home
        </Link>

        {user?.role === "student" && (
          <Link to="/my-courses" className="hover:text-accent transition">
            My Courses
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="hover:text-accent transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-accent transition">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* Avatar + Upload */}
            <div
              className="relative w-12 h-12 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {user.profilePic ? (
                <img
                  src={`http://localhost:4000${user.profilePic}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                />
              ) : (
                <img
                  src="/default-avatar.png"
                  alt="Default Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                />
              )}
              <span className="absolute bottom-0 right-0 bg-accent text-darkBg rounded-full p-1 text-xs">
                📷
              </span>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <span className="text-gray-300">
              Hi, <span className="text-accent font-semibold">{user.name}</span>
            </span>

            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
