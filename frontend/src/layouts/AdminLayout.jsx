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

  // ✅ Navigation links config — permission keys match MentorAccess.jsx
  const navLinks = [
    { to: "dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "mentor"], permission: "dashboard" },

    // Admin-only
    { to: "admins", label: "Admins", icon: "🛠️", roles: ["admin"] },
    { to: "students", label: "Students", icon: "📝", roles: ["admin"] },
    { to: "mentors", label: "Mentors", icon: "👨‍🏫", roles: ["admin"] },
    { to: "add-course", label: "Add Course", icon: "➕", roles: ["admin"] },

    // Shared with mentors — need permission
    { to: "enrolled-students", label: "Enrolled Students", icon: "👨‍🎓", roles: ["admin", "mentor"], permission: "students" },
    { to: "upload", label: "Upload Video", icon: "📤", roles: ["admin", "mentor"], permission: "videos" },
    { to: "videos", label: "Manage Videos", icon: "🎥", roles: ["admin", "mentor"], permission: "videos" },
    { to: "payments", label: "Payments", icon: "💳", roles: ["admin", "mentor"], permission: "payments" },
  ];

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
    <div className="flex min-h-screen bg-darkBg text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-darkCard border-r border-gray-700 flex flex-col fixed h-full">
        {/* Brand */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-extrabold text-accent">Last Try Academy</h2>
          <p className="text-sm text-gray-400 mt-2">Role: {user.role}</p>
          <p className="text-sm text-gray-400">Name: {user.name}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3">
          {navLinks.filter(hasAccess).map((link) => {
            const active = location.pathname.includes(`/admin/${link.to}`);
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
        {canViewPage ? (
          <Outlet />  
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="p-8 bg-darkCard border border-red-500 rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold text-red-500 mb-4">⛔ No Access</h1>
              <p className="text-gray-400 mb-6">
                You don’t have permission to view this page. Please contact Admin.
              </p>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-2 bg-accent text-darkBg rounded-lg font-semibold shadow hover:opacity-90 transition"
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
