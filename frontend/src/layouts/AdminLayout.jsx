// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink as RouterNavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCurrencyRupee,
  HiOutlineAcademicCap,
  HiOutlineHome,
  HiOutlineCog,
} from "react-icons/hi";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        // ignore - will handle when user isn't logged in
      }
    }
    load();
  }, []);

  // dispatch global-search event for pages to listen
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    window.dispatchEvent(new CustomEvent("global-search", { detail: value }));
  };

  const navLinks = [
    { to: "home", label: "Home", icon: <HiOutlineHome size={20} /> },
    { to: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar size={20} /> },
    { to: "courses", label: "Courses", icon: <HiOutlineBookOpen size={20} /> },
    { to: "admins", label: "Admins", icon: <HiOutlineUser size={20} /> },
    { to: "mentors", label: "Mentors", icon: <HiOutlineAcademicCap size={20} /> },
    { to: "students", label: "Students", icon: <HiOutlineUserGroup size={20} /> },
    { to: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee size={20} /> },
    { to: "team", label: "Team", icon: <HiOutlineUserGroup size={20} /> },
    { to: "settings", label: "Settings", icon: <HiOutlineCog size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#05060d] text-gray-100">
      <aside className={`transition-all duration-300 ${collapsed ? "w-20" : "w-64"} bg-[#0b1124]/95 border-r border-white/10`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">L</div>
              {!collapsed && (
                <div>
                  <p className="font-semibold text-[15px]">Last Try Academy</p>
                  <p className="text-[11px] text-gray-400">Admin Panel</p>
                </div>
              )}
            </div>

            <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
              {collapsed ? <FaChevronRight size={13} /> : <FaChevronLeft size={13} />}
            </button>
          </div>

          <div className={`mx-3 mb-4 ${collapsed ? "flex justify-center" : "flex items-center gap-3 px-3 py-2"} bg-white/5 border border-white/10 rounded-xl`}>
            <img src={user?.profilePic ? `${(import.meta.env.VITE_API_URL || "http://localhost:4000")}${user.profilePic}` : "/default-avatar.png"} alt="profile" className={`${collapsed ? "w-10 h-10" : "w-12 h-12"} rounded-full border-2 border-blue-500 object-cover`} />
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold">{user?.name || "Admin"}</p>
                <p className="text-xs text-blue-400">{user?.role || "Administrator"}</p>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto px-2 space-y-1">
            {navLinks.map((link) => (
              <RouterNavLink
                key={link.to}
                to={`/admin/${link.to}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl ${collapsed ? "justify-center py-3" : "px-4 py-3"} ${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-300 hover:bg-white/5"}`
                }
              >
                <span className="text-[20px]">{link.icon}</span>
                {!collapsed && <span className="text-[14px]">{link.label}</span>}
              </RouterNavLink>
            ))}
          </nav>

          <div className="p-4 mt-2">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition">
              <FaSignOutAlt />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-8 bg-[#0b1124]/95 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><FaArrowLeft /></button>
            <button onClick={() => navigate(1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><FaArrowRight /></button>
          </div>

          <div className="w-full max-w-lg px-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/5 border border-white/10">
              <FaSearch className="text-blue-400" />
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search courses, videos, students, mentors, payments..."
                className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <FaBell className="text-blue-400" />
              <span className="absolute -top-1 -right-1 text-[10px] px-1 rounded-full bg-red-500">6</span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <p className="text-sm">{user?.name?.split?.(" ")?.[0] || "Admin"}</p>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">{user?.name ? user.name[0] : "A"}</div>
            </div>
          </div>
        </header>

        <main className="flex-1  bg-[#04060f] overflow-y-auto">
          {/* p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl */}
          <div className="">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
