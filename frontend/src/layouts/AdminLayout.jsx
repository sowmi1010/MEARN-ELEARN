import React, { useState, useEffect, useRef } from "react";
import {
  NavLink as RouterNavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import api from "../utils/api";
import {
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCurrencyRupee,
  HiOutlineAcademicCap,
  HiOutlineHome,
} from "react-icons/hi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ Always dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // ✅ Fetch User
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);

  // ✅ GLOBAL SEARCH BROADCAST
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // 🔥 Broadcast to ALL admin pages
    window.dispatchEvent(
      new CustomEvent("admin-global-search", {
        detail: value,
      })
    );
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinks = [
    { to: "home", label: "Home", icon: <HiOutlineHome /> },
    { to: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
    { to: "courses", label: "Courses", icon: <HiOutlineBookOpen /> },
    { to: "admins", label: "Admins", icon: <HiOutlineUser /> },
    { to: "mentors", label: "Mentors", icon: <HiOutlineAcademicCap /> },
    { to: "students", label: "Students", icon: <HiOutlineUserGroup /> },
    { to: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee /> },
    { to: "team", label: "Team", icon: <HiOutlineUserGroup /> },
        { to: "settings", label: "Settings", icon: <HiOutlineUser /> },

  ];

  return (
    <div className="flex h-screen w-full bg-[#070b1a] text-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-[#0c1633] to-[#050815] border-r border-blue-900/40 flex flex-col">
        {/* PROFILE */}
        <div className="p-6 text-center border-b border-blue-900/40">
          <img
            src={
              user?.profilePic
                ? `http://localhost:4000${user.profilePic}`
                : "/default-avatar.png"
            }
            className="w-24 h-24 rounded-full border-2 border-blue-600 mx-auto object-cover"
          />

          <h2 className="text-lg font-bold mt-2">{user?.name || "Admin"}</h2>
          <p className="text-xs text-blue-400">{user?.role}</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.to}
              to={`/admin/${link.to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition 
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-blue-800/40 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </RouterNavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-blue-900/40">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        {/* ================= HEADER ================= */}
        <header className="h-16 px-6 bg-[#0c1633] border-b border-blue-900/40 flex items-center justify-between">
          {/* ✅ GLOBAL SEARCH BAR */}
          <div className="flex items-center bg-[#060a15] border border-blue-700/50 rounded-full px-4 py-2 w-[450px] shadow-md">
            <FaSearch className="text-blue-400 mr-2" />
            <input
              value={search}
              onChange={handleSearchChange}
              className="bg-transparent w-full outline-none text-sm text-white placeholder:text-gray-500"
              placeholder="Search videos, books, notes, tests, students..."
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={() => navigate(1)}
              className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaArrowRight />
            </button>

            <div className="relative">
              <FaBell className="text-blue-400 text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
                6
              </span>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-8 bg-[#040711] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
