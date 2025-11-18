// src/layouts/StudentLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar";

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-gray-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
