// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // 🌓 Apply theme
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // ✅ Navigation links config
  const navLinks = [
    { to: "dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "mentor"], permission: "dashboard" },
    { to: "admins", label: "Admins", icon: "🛠️", roles: ["admin"] },
    { to: "students", label: "Students", icon: "📝", roles: ["admin"] },
    { to: "mentors", label: "Mentors", icon: "👨‍🏫", roles: ["admin"] },
    { to: "teachers", label: "Teachers", icon: "👩‍🏫", roles: ["admin"] },
    { to: "feedbacks", label: "Feedbacks", icon: "💬", roles: ["admin"] },
    { to: "add-course", label: "Add Course", icon: "➕", roles: ["admin"] },
    { to: "enrolled-students", label: "Enrolled Students", icon: "👨‍🎓", roles: ["admin", "mentor"], permission: "students" },
    { to: "upload", label: "Upload Video", icon: "📤", roles: ["admin", "mentor"], permission: "videos" },
    { to: "videos", label: "Manage Videos", icon: "🎥", roles: ["admin", "mentor"], permission: "videos" },
    { to: "payments", label: "Payments", icon: "💳", roles: ["admin", "mentor"], permission: "payments" },
  ];

  // ✅ Access control
  const hasAccess = (link) => {
    if (!user?.role) return false;
    if (user.role === "admin") return link.roles.includes("admin");
    if (user.role === "mentor") {
      return (
        link.roles.includes("mentor") &&
        (!link.permission || (user.permissions || []).includes(link.permission))
      );
    }
    return false;
  };

  const currentLink = navLinks.find((link) =>
    location.pathname.includes(`/admin/${link.to}`)
  );
  const canViewPage = !currentLink || hasAccess(currentLink);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-darkCard border-r border-gray-300 dark:border-gray-700 flex flex-col fixed h-full transition-colors duration-300">
        {/* Brand */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
            E-Learn Admin
          </h2>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Role: {user.role}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Name: {user.name}</p>

          {/* 🌗 Theme Toggle */}
          <div className="mt-4 flex items-center gap-2">
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
                  bg-gray-300 dark:bg-gray-600
                  peer-checked:bg-gradient-to-r peer-checked:from-accent peer-checked:to-blue-500
                  transition-colors duration-300
                "
              ></div>
              <div
                className="
                  absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow
                  flex items-center justify-center text-sm
                  peer-checked:translate-x-7 transition-transform duration-300
                "
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </label>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.filter(hasAccess).map((link) => {
            const active = location.pathname.includes(`/admin/${link.to}`);
            return (
              <Link
                key={link.to}
                to={link.to}              // ✅ stays relative
                relative="path"          // ✅ makes it append to /admin
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-accent to-blue-500 text-darkBg shadow-md"
                      : "hover:bg-accent/20 hover:text-accent text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="
              w-full px-4 py-2 rounded-lg font-semibold
              bg-red-500 hover:bg-red-600 text-white
              transition-all duration-300 shadow
            "
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-gray-50 dark:bg-darkBg transition-colors duration-300">
        {canViewPage ? (
          <Outlet />
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="p-8 bg-white dark:bg-darkCard border border-red-400 rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold text-red-500 mb-4">⛔ No Access</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You don’t have permission to view this page. Please contact the admin.
              </p>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="
                  px-6 py-2 rounded-lg font-semibold
                  bg-gradient-to-r from-accent to-blue-500 text-darkBg
                  hover:scale-[1.03] hover:shadow-md transition-all duration-300
                "
              >
                Go Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
