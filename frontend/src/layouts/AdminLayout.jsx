import React, { useState, useEffect, useRef } from "react";
import {
  NavLink as RouterNavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "../utils/api";
import {
  FaMoon,
  FaSun,
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
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  /* ======================================================
     ✅ Apply Theme
  ====================================================== */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  /* ======================================================
     ✅ Fetch Current User Info
  ====================================================== */
  useEffect(() => {
    async function fetchCurrentUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      } catch (err) {
        console.error("User sync failed:", err.response?.data || err.message);
        setUser(null);
      }
    }

    fetchCurrentUser();
    window.addEventListener("user-login", fetchCurrentUser);
    window.addEventListener("user-logout", () => setUser(null));

    return () => {
      window.removeEventListener("user-login", fetchCurrentUser);
      window.removeEventListener("user-logout", () => setUser(null));
    };
  }, []);

  /* ======================================================
     ✅ Logout Handler
  ====================================================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("user-logout"));
    navigate("/login");
  };

  /* ======================================================
     ✅ Profile Upload
  ====================================================== */
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
      window.dispatchEvent(new Event("user-login"));
    } catch (err) {
      console.error("Profile upload error:", err);
      alert("Failed to update profile picture");
    }
  };

  /* ======================================================
     ✅ Sidebar Navigation Links
  ====================================================== */
  const allNavLinks = [
    { key: "dashboard", to: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
    { key: "home", to: "home", label: "Home", icon: <HiOutlineHome /> },
    { key: "courses", to: "courses", label: "Courses", icon: <HiOutlineBookOpen /> },
    { key: "admins", to: "admins", label: "Admins", icon: <HiOutlineUser /> },
    { key: "mentors", to: "mentors", label: "Mentors", icon: <HiOutlineAcademicCap /> },
    { key: "students", to: "students", label: "Students", icon: <HiOutlineUserGroup /> },
    { key: "payments", to: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee /> },
    { key: "team", to: "team", label: "Team", icon: <HiOutlineUserGroup /> },
  ];

  const role = (user?.role || "").toLowerCase();
  const isAdminLike = role === "admin" || user?.isSuperAdmin === true;

  const defaultAdminLinks = [
    "dashboard",
    "home",
    "courses",
    "admins",
    "mentors",
    "students",
    "payments",
    "team",
  ];

  const visibleLinks = isAdminLike
    ? allNavLinks
    : allNavLinks.filter((link) =>
        (user?.permissions || defaultAdminLinks).includes(link.key)
      );

  const sortedLinks = visibleLinks.sort((a, b) => {
    const order = user?.permissions || [];
    return order.indexOf(a.key) - order.indexOf(b.key);
  });

  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  /* ======================================================
     ✅ JSX Layout
  ====================================================== */
  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-gradient-to-b from-[#0c1633] to-[#091025] shadow-xl border-r border-gray-800 flex flex-col">
        {/* ✅ User Info + Upload */}
        <div className="p-6 flex flex-col items-center border-b border-gray-700">
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer hover:scale-105 transition"
          >
            <img
              src={
                user?.profilePic
                  ? `http://localhost:4000${user.profilePic}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 bg-black/50 text-white text-xs w-full text-center py-1">
              Change
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <h1 className="text-lg font-extrabold text-white mt-2">
            Last Try Academy
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Role: {user?.role || "User"}
          </p>
          {user?.isSuperAdmin && (
            <p className="text-xs text-yellow-400 font-semibold">
              Super Admin
            </p>
          )}
          <p className="text-xs text-gray-500">{user?.name || "User"}</p>
        </div>

        {/* ===== Navigation ===== */}
        <nav className="flex-1 mt-4 space-y-2 overflow-y-auto">
          {sortedLinks.map((link) => (
            <RouterNavLink
              key={link.to}
              to={`/admin/${link.to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-blue-500/20 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        {/* ===== Theme + Logout ===== */}
        <div className="p-5 border-t border-gray-700 mt-auto">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-full gap-2 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-semibold transition"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}{" "}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 py-2 mt-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* ===== Top Navbar ===== */}
        <header className="h-16 bg-[#0c1633] border-b border-gray-800 flex items-center justify-between px-6 shadow-md fixed top-0 left-64 right-0 z-20">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-72 text-gray-300">
            <FaSearch className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full text-gray-200 placeholder-gray-400"
            />
          </div>

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
