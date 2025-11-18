// src/components/student/StudentSidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentSidebar() {
  const navigate = useNavigate();
  const menu = [
    { to: "/student", label: "Dashboard" },
    { to: "/student/videos", label: "Videos" },
    { to: "/student/books", label: "Books" },
    { to: "/student/notes", label: "Notes" },
    { to: "/student/tests", label: "Test" },
    { to: "/student/quiz", label: "Quiz" },
    { to: "/student/live", label: "Live" },
    { to: "/student/academy", label: "Academy" },
    { to: "/student/todo", label: "To-Do" },
    { to: "/student/marks", label: "Marks" },
    { to: "/student/courses", label: "Courses" },
    { to: "/student/certificate", label: "Certificate" },
    { to: "/student/team", label: "Team" },
    { to: "/student/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-[#041028] min-h-screen p-4 border-r border-[#0f172a]">
      <div className="mb-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-purple-500">
          <img src={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).profilePic || "/default-avatar.png" : "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover"/>
        </div>
        <div className="mt-3 text-sm text-gray-300">Last Try Academy</div>
      </div>

      <nav className="space-y-2">
        {menu.map((m) => (
          <Link key={m.to} to={m.to} className="block px-3 py-2 rounded hover:bg-[#0b1630] text-gray-300">
            {m.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.dispatchEvent(new Event("user-logout")); navigate("/"); }} className="w-full bg-red-600 text-white py-2 rounded">Logout</button>
      </div>
    </aside>
  );
}
