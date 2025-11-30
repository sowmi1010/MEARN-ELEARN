import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiMenu,
  HiX,
} from "react-icons/hi";

import { FiBook, FiSettings, FiUsers } from "react-icons/fi";
import { MdOutlineOndemandVideo, MdQuiz } from "react-icons/md";
import { RiBookOpenLine, RiTestTubeLine } from "react-icons/ri";
import { PiCertificate } from "react-icons/pi";

import {
  FaTasks,
  FaVideo,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaChartLine,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import useGlobalSearch from "../hooks/useGlobalSearch";

export default function StudentLayout() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const { search, results, loading } = useGlobalSearch("global-search");

  /* -------------------------------------------------
      🔥 Load Real User (/api/auth/me)
  --------------------------------------------------*/
  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch user:", res.status);
          return;
        }

        const data = await res.json();
        if (data?.id) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
          window.dispatchEvent(new Event("user-updated"));
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }

    loadUser();
  }, []);

  /* Sync user when changed anywhere */
  useEffect(() => {
    const refresh = () => {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    };

    window.addEventListener("user-updated", refresh);
    return () => window.removeEventListener("user-updated", refresh);
  }, []);

  const handleGlobalSearch = (value) => {
    window.dispatchEvent(new CustomEvent("global-search", { detail: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-logout"));
    navigate("/");
  };

  /* ---------------------------------------------
      ⚡ STANDARDIZED PROFILE PIC
  ---------------------------------------------*/
  const profilePic =
    user?.profilePic
      ? `http://localhost:4000${user.profilePic}`
      : "/default-avatar.png";

  /* --------------------------------------------
      📌 Student Menu
  ---------------------------------------------*/
  const menu = [
    { to: "/student", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/student/videos", label: "Videos", icon: <MdOutlineOndemandVideo /> },
    { to: "/student/books", label: "Books", icon: <FiBook /> },
    { to: "/student/notes", label: "Notes", icon: <HiOutlineClipboardList /> },
    { to: "/student/tests", label: "Tests", icon: <RiTestTubeLine /> },
    { to: "/student/quiz", label: "Quiz", icon: <MdQuiz /> },
    { to: "/student/live", label: "Live", icon: <FaVideo /> },
    { to: "/student/todo", label: "To-Do", icon: <FaTasks /> },
    { to: "/student/marks", label: "Marks", icon: <FaChartLine /> },
    { to: "/student/courses", label: "Courses", icon: <RiBookOpenLine /> },
    { to: "/student/certificate", label: "Certificates", icon: <PiCertificate /> },
    { to: "/student/team", label: "Team", icon: <FiUsers /> },
    { to: "/student/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#070615] text-gray-100">

      {/* -----------------------------------------
            🌟 SIDEBAR 
      ------------------------------------------*/}
      <aside
        className={`fixed z-40 top-0 left-0 h-full bg-gradient-to-b 
          from-[#0a0a12] to-[#09070f] border-r border-purple-900/30 shadow-2xl
          transition-all ${collapsed ? "w-20" : "w-72"} hidden md:flex flex-col`}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-purple-900/20">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              className={`rounded-md object-cover ${collapsed ? "w-8 h-8" : "w-12 h-12"}`}
            />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-purple-300">Last Try</h1>
                <p className="text-xs text-gray-400 -mt-1">Academy</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-1 rounded-md hover:bg-purple-800/30"
          >
            {collapsed ? <HiMenu className="text-purple-300" /> : <HiX className="text-purple-300" />}
          </button>
        </div>

        {/* Profile */}
        <div className="px-3 py-5 border-b border-purple-900/20">
          <div className={`flex items-center gap-3 ${collapsed && "flex-col"}`}>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-600 shadow-md cursor-pointer"
            >
              <img src={profilePic} className="w-full h-full object-cover" />
            </div>

            {!collapsed && (
              <div>
                <div className="text-sm font-semibold text-purple-200">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-gray-400">
                  Welcome back 🎓
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 custom-scroll">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all 
                ${
                  isActive
                    ? "bg-purple-700 text-white shadow-md"
                    : "text-gray-300 hover:bg-purple-900/30 hover:text-purple-200"
                }`
              }
            >
              <span className="text-lg">{m.icon}</span>
              {!collapsed && <span>{m.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-purple-900/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <input ref={fileInputRef} type="file" className="hidden" />
      </aside>

      {/* -----------------------------------------
            🌟 HEADER + CONTENT
      ------------------------------------------*/}
      <div className="flex-1 ml-0 md:ml-20 lg:ml-72 flex flex-col">

        {/* HEADER */}
        <header
          className={`fixed top-0 right-0 z-30 h-16 backdrop-blur-xl border-b border-purple-900/20
          bg-[#0f0c18]/60 flex items-center justify-between px-4 md:px-6
          transition-all ${collapsed ? "left-20" : "left-72"}`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1d1a27]/60 
              border border-purple-800/30 hover:bg-purple-900/40"
            >
              <FaArrowLeft className="text-purple-300 text-lg" />
            </button>

            <button
              onClick={() => navigate(1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1d1a27]/60 
              border border-purple-800/30 hover:bg-purple-900/40"
            >
              <FaArrowRight className="text-purple-300 text-lg" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="hidden md:flex items-center bg-[#1d1a27]/60 border border-purple-800/40 
              rounded-full px-4 py-2 w-full max-w-xl shadow-lg"
            >
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                className="bg-transparent text-sm text-gray-200 outline-none w-full"
                placeholder="Search lessons, quizzes, books..."
                onChange={(e) => handleGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">

            <button className="relative p-2 rounded-full hover:bg-purple-800/20">
              <FaBell className="text-purple-300 text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-[9px] px-[5px] py-[1px] rounded-full">
                4
              </span>
            </button>

            <div className="flex items-center gap-3 bg-[#181522]/80 px-3 py-1 border border-purple-800/30 rounded-full shadow-md">
              <div className="text-right">
                <div className="text-sm font-semibold text-purple-200">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-gray-400 -mt-1">
                  {(user?.role || "member").toUpperCase()}
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current.click()}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-600 cursor-pointer"
              >
                <img src={profilePic} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 pt-20 px-4 md:px-6 pb-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
