import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaSignOutAlt, FaBell, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCurrencyRupee,
  HiOutlineChatAlt2,
  HiOutlineAcademicCap,
} from "react-icons/hi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Theme + User
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { to: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
    { to: "courses", label: "Courses", icon: <HiOutlineBookOpen /> },
    { to: "admins", label: "Admins", icon: <HiOutlineUser /> },
    { to: "mentors", label: "Mentors", icon: <HiOutlineAcademicCap /> },
    { to: "students", label: "Students", icon: <HiOutlineUserGroup /> },
    { to: "feedbacks", label: "Feedbacks", icon: <HiOutlineChatAlt2 /> },
    { to: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee /> },
  ];

  // ✅ Navigation arrows
  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-gradient-to-b from-[#0c1633] to-[#091025] shadow-xl border-r border-gray-800 flex flex-col">
        {/* Logo + User Info */}
        <div className="p-6 flex flex-col items-center border-b border-gray-700">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mb-2 rounded-full shadow-lg" />
          <h1 className="text-lg font-extrabold text-white">Last Try Academy</h1>
          <p className="text-sm text-gray-400 mt-2">Role: {user.role || "Admin"}</p>
          <p className="text-xs text-gray-500">Name: {user.name || "Super Admin"}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={`/admin/${link.to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300
                 ${
                   isActive
                     ? "bg-blue-600 text-white shadow-md"
                     : "text-gray-300 hover:bg-blue-500/20 hover:text-white"
                 }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Theme + Logout */}
        <div className="p-5 border-t border-gray-700 mt-auto">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-full gap-2 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-semibold transition"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />} {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 py-2 mt-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* ===== Top Navbar ===== */}
        <header className="h-16 bg-[#0c1633] border-b border-gray-800 flex items-center justify-between px-6 shadow-md fixed top-0 left-64 right-0 z-20">
          {/* Search bar */}
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-72 text-gray-300">
            <FaSearch className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow hover:scale-105 transition"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={handleForward}
              className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow hover:scale-105 transition"
            >
              <FaArrowRight />
            </button>

            <div className="relative">
              <FaBell className="text-xl text-blue-400 cursor-pointer hover:scale-110 transition" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full px-1.5">
                6
              </span>
            </div>
          </div>
        </header>

        {/* ===== Page Content ===== */}
        <main className="flex-1 mt-16 overflow-y-auto bg-gray-100 dark:bg-[#0b0f19] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
