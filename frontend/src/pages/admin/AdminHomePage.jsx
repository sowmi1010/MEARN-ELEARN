// src/pages/admin/AdminHomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserAdd, HiOutlineChatAlt2 } from "react-icons/hi";

export default function AdminHomePage() {
  const navigate = useNavigate();

  return (
    <div className="text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-3xl font-extrabold mb-6">Welcome, Admin</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Quick actions to manage your academy efficiently.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
        {/* ✅ Add Teacher Button */}
        <button
          onClick={() => navigate("/admin/teachers")}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-lg py-6 rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          <HiOutlineUserAdd className="text-3xl" />
          Add Teacher
        </button>

        {/* ✅ Add Feedback Button */}
        <button
          onClick={() => navigate("/admin/feedbacks")}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold text-lg py-6 rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          <HiOutlineChatAlt2 className="text-3xl" />
          Add Feedback
        </button>
      </div>
    </div>
  );
}
