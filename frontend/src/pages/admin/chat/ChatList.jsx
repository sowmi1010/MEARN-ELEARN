import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // ✅ Global search
  const search = useGlobalSearch();

  // ✅ Fetch users (admins + students)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [adminsRes, studentsRes] = await Promise.all([
          api.get("/admin/detailed-admins", { headers }),
          api.get("/student/detailed-students", { headers }),
        ]);

        const combined = [
          ...adminsRes.data.map((a) => ({
            _id: a._id,
            name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
            role: "admin",
            board: "-",
            standard: "-",
            state: a.state || "-",
            profilePic: a.photo
              ? `http://localhost:4000${a.photo}`
              : "/default-avatar.png",
          })),

          ...studentsRes.data.map((s) => ({
            _id: s._id,
            name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
            role: "student",
            board: s.board || "-",
            standard: s.standard || "-",
            state: s.state || "-",
            profilePic: s.photo
              ? `http://localhost:4000${s.photo}`
              : "/default-avatar.png",
          })),
        ];

        setUsers(combined);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // ✅ FILTER USERS BY GLOBAL SEARCH
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.role} ${u.board} ${u.standard}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ Dynamic chart data
  const chatStats = [
    { label: "Admins", total: users.filter((u) => u.role === "admin").length },
    {
      label: "Students",
      total: users.filter((u) => u.role === "student").length,
    },
    { label: "Total", total: users.length },
  ];

  const totalMessages = (users.length * 42).toLocaleString(); // dynamic (replace later with real messages count)

  const handleChat = (userId) => {
    navigate(`/admin/team/${userId}`);
  };

  const formatTime = () =>
    new Date().toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="p-6 bg-[#0b0f19] text-white min-h-screen">

      {/* ===== Header Section ===== */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">

        {/* Chart Insights */}
        <div className="lg:w-3/4 bg-[#111827] rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">
            Team Analytics
          </h2>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chatStats}>
              <XAxis dataKey="label" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Messages Card */}
        <div className="lg:w-1/4 bg-[#111827] rounded-xl p-6 shadow-md flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-gray-200 mb-3">
            Messages
          </h2>

          <p className="text-gray-400">Total Messages</p>
          <p className="text-3xl font-bold text-blue-400">
            {totalMessages}
          </p>

          <p className="text-xs mt-3 text-gray-500">
            Based on active users
          </p>
        </div>

      </div>

      {/* ===== User Table ===== */}
      <div className="bg-[#111827] rounded-xl p-4 shadow-md overflow-x-auto">

        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Profile</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Board</th>
              <th className="py-3 px-3">Standard</th>
              <th className="py-3 px-3">State</th>
              <th className="py-3 px-3">Last Active</th>
              <th className="py-3 px-3 text-center">Chat</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-[#1e293b] transition duration-200"
                >
                  <td className="py-3 px-3">{index + 1}</td>

                  <td className="py-3 px-3">
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-blue-500 object-cover"
                    />
                  </td>

                  <td className="py-3 px-3 font-semibold">
                    {user.name}
                  </td>

                  <td className="py-3 px-3 text-blue-400 capitalize">
                    {user.role}
                  </td>

                  <td className="py-3 px-3">{user.board}</td>
                  <td className="py-3 px-3">{user.standard}</td>
                  <td className="py-3 px-3">{user.state}</td>

                  <td className="py-3 px-3 text-gray-400">
                    {formatTime()}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleChat(user._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                    >
                      Chat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ChatList;
