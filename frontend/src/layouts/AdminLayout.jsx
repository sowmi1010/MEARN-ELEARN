import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // ✅ Navigation links config
  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/upload", label: "Upload Video", icon: "📤" },
    { to: "/admin/add-course", label: "Add Course", icon: "➕" },
    { to: "/admin/videos", label: "Manage Videos", icon: "🎥" },
    { to: "/admin/students", label: "Students", icon: "👨‍🎓" },
    { to: "/admin/payments", label: "Payments", icon: "💳" },
  ];

  return (
    <div className="flex min-h-screen bg-darkBg text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-darkCard border-r border-gray-700 flex flex-col fixed h-full">
        {/* Brand */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-extrabold text-accent">
            Last Try Academy
          </h2>
          <p className="text-sm text-gray-400 mt-2">Role: {user.role}</p>
          <p className="text-sm text-gray-400">Name: {user.name}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                  active
                    ? "bg-accent text-darkBg font-semibold shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-accent"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-darkBg">
        <Outlet /> {/* Child admin pages render here */}
      </main>
    </div>
  );
}
