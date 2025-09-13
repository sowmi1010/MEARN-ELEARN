import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-darkBg text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-darkCard p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-accent mb-6">Last Try Academy</h2>
        <p className="text-sm mb-4">Role: {user.role}</p>
        <p className="text-sm mb-8">Name: {user.name}</p>

        <nav className="flex flex-col space-y-4">
          <Link to="/admin/dashboard" className="hover:text-accent">
            📊 Dashboard
          </Link>
          <Link to="/admin/upload" className="hover:text-accent">
            📤 Upload Video
          </Link>
          <Link to="/admin/add-course" className="hover:text-accent">
            ➕ Add Course
          </Link>
          <Link to="/admin/videos" className="hover:text-accent">
            🎥 Manage Videos
          </Link>
          <Link to="/admin/students" className="hover:text-accent">
            👨‍🎓 Students
          </Link>
          <Link to="/admin/payments" className="hover:text-accent">
            💳 Payments
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <Outlet /> {/* Child pages will render here */}
      </main>
    </div>
  );
}
