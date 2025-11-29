import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { HiOutlineHome, HiOutlineClipboardList } from "react-icons/hi";
import { FiBook, FiSettings, FiUsers } from "react-icons/fi";
import { MdOutlineOndemandVideo, MdQuiz } from "react-icons/md";
import { RiBookOpenLine, RiTestTubeLine } from "react-icons/ri";
import { PiCertificate } from "react-icons/pi";
import {
  FaTasks,
  FaVideo,
  FaSearch,
  FaBell,
  FaArrowLeft,
  FaArrowRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

export default function StudentLayout() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);

  /* =====================================================
        LOAD USER FROM LOCAL STORAGE
  ===================================================== */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  /* =====================================================
        🔥 LISTEN FOR PROFILE UPDATE (AUTO REFRESH SIDEBAR)
  ===================================================== */
  useEffect(() => {
    function refreshUser() {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    }

    window.addEventListener("user-updated", refreshUser);
    return () => window.removeEventListener("user-updated", refreshUser);
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

  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  const menu = [
    { to: "/student", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/student/videos", label: "Videos", icon: <MdOutlineOndemandVideo /> },
    { to: "/student/books", label: "Books", icon: <FiBook /> },
    { to: "/student/notes", label: "Notes", icon: <HiOutlineClipboardList /> },
    { to: "/student/tests", label: "Tests", icon: <RiTestTubeLine /> },
    { to: "/student/quiz", label: "Quiz", icon: <MdQuiz /> },
    { to: "/student/live", label: "Live", icon: <FaVideo /> },
    { to: "/student/todo", label: "To-Do", icon: <FaTasks /> },
    { to: "/student/marks", label: "Marks", icon: <TbReportAnalytics /> },
    { to: "/student/courses", label: "Courses", icon: <RiBookOpenLine /> },
    { to: "/student/certificate", label: "Certificates", icon: <PiCertificate /> },
    { to: "/student/team", label: "Team", icon: <FiUsers /> },
    { to: "/student/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#07070f] text-gray-100">
      {/* =====================================================
            SIDEBAR 
      ===================================================== */}
      <aside className="w-64 fixed top-0 left-0 h-full bg-gradient-to-b 
        from-[#0d0d1a] to-[#0a0a14] border-r border-purple-800/30 shadow-2xl">

        {/* Profile Section */}
        <div className="p-6 text-center border-b border-purple-800/30">
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-20 h-20 mx-auto rounded-full overflow-hidden 
            border-2 border-purple-500 shadow-purple-500/30 shadow-md
            cursor-pointer hover:scale-105 transition"
          >
            <img
              src={
                user?.profilePic
                  ? `http://localhost:4000${user.profilePic}`
                  : "/default-avatar.png"
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="mt-3 text-lg font-semibold text-purple-400 tracking-wide">
            {user?.name || "Student"}
          </h2>
          <p className="text-gray-400 text-sm">Last Try Academy</p>

          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" />
        </div>

        {/* Menu */}
        <nav className="px-4 py-3 space-y-1 overflow-y-auto h-[65vh]">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-300 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-xl shadow-purple-600/30 scale-[1.02]"
                      : "text-gray-300 hover:bg-purple-900/30 hover:text-purple-300"
                  }`
              }
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-purple-800/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 
              bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg 
              font-semibold shadow"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
            MAIN AREA
      ===================================================== */}
      <div className="flex-1 ml-64 flex flex-col">
        <header
          className="h-16 bg-[#0f0f1a]/80 backdrop-blur-md 
          border-b border-purple-800/30 flex items-center justify-between 
          px-6 fixed top-0 left-64 right-0 z-20 shadow-lg"
        >
          <div
            className="flex items-center bg-[#1a1a2b]/60 backdrop-blur-xl 
            rounded-full px-4 py-2 w-80 border border-purple-700/30"
          >
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search lessons, quizzes, courses..."
              className="bg-transparent text-sm text-gray-200 outline-none w-full"
              onChange={(e) => handleGlobalSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 bg-purple-600 text-white rounded-full 
              flex items-center justify-center hover:bg-purple-700 shadow-lg transition"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={handleForward}
              className="w-10 h-10 bg-purple-600 text-white rounded-full 
              flex items-center justify-center hover:bg-purple-700 shadow-lg transition"
            >
              <FaArrowRight />
            </button>

            <div className="relative cursor-pointer">
              <FaBell className="text-xl text-purple-400 hover:scale-110 transition" />
              <span
                className="absolute -top-1 -right-1 bg-red-600 text-[10px] 
                rounded-full px-1 text-white shadow-md"
              >
                4
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 mt-16 p-6 overflow-y-auto bg-[#07070f]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
