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

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // 📊 Dummy analytics (you can later connect to real stats)
  const chatStats = [
    { month: "Jan", total: 100 },
    { month: "Feb", total: 120 },
    { month: "Mar", total: 260 },
    { month: "Apr", total: 180 },
    { month: "May", total: 240 },
    { month: "Jun", total: 350 },
    { month: "Jul", total: 320 },
    { month: "Aug", total: 290 },
    { month: "Sep", total: 270 },
    { month: "Oct", total: 310 },
    { month: "Nov", total: 280 },
    { month: "Dec", total: 330 },
  ];

  // ✅ Fetch users (admins + students)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [adminsRes, studentsRes] = await Promise.all([
          api.get("/admin/detailed-admins"),
          api.get("/admin/students"),
        ]);

        // ✅ Combine into one array
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
            board: s.board || "CBSE",
            standard: s.standard || "10th",
            state: s.state || "Tamil Nadu",
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

  // ✅ Navigate to chat window
  const handleChat = (userId) => {
    navigate(`/admin/team/${userId}`);
  };

  // ✅ Helper: Format time
  const formatTime = () =>
    new Date().toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="p-6 bg-[#0b0f19] text-white min-h-screen">
      {/* ===== Header Section ===== */}
      <div className="flex justify-between items-start mb-6">
        {/* Chart Insights */}
        <div className="w-3/4 bg-[#111827] rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">
            Chat Insights
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chatStats}>
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#00C6FF"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Messages Card */}
        <div className="w-1/4 bg-[#111827] rounded-xl p-4 ml-4 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-200">Chat</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-1">
              +
            </button>
          </div>
          <div className="mt-6 text-right">
            <p className="text-gray-400">Total Messages</p>
            <p className="text-3xl font-bold text-white">
              {(chatStats.reduce((a, c) => a + c.total, 0) / 100).toFixed(1)}k
            </p>
          </div>
        </div>
      </div>

      {/* ===== User Table ===== */}
      <div className="bg-[#111827] rounded-xl p-4 shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="py-3 px-3 text-left">#</th>
              <th className="py-3 px-3 text-left">About</th>
              <th className="py-3 px-3 text-left">Notification</th>
              <th className="py-3 px-3 text-left">Profile</th>
              <th className="py-3 px-3 text-left">Name</th>
              <th className="py-3 px-3 text-left">Board</th>
              <th className="py-3 px-3 text-left">Standard</th>
              <th className="py-3 px-3 text-left">State</th>
              <th className="py-3 px-3 text-left">Last Active</th>
              <th className="py-3 px-3 text-center">Chat</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-[#1e293b] transition duration-200"
                >
                  <td className="py-3 px-3">{index + 1}</td>

                  <td className="py-3 px-3">
                    <button className="border border-yellow-500 text-yellow-500 text-xs px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition">
                      About
                    </button>
                  </td>

                  {/* ✅ Notification bubble fixed */}
                  <td className="py-3 px-3">
                    <div className="relative w-fit">
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        {Math.floor(Math.random() * 5) + 1}
                      </span>
                    </div>
                  </td>

                  {/* ✅ Profile Image fixed */}
                  <td className="py-3 px-3">
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border border-gray-600 object-cover"
                    />
                  </td>

                  <td className="py-3 px-3">{user.name}</td>
                  <td className="py-3 px-3">{user.board}</td>
                  <td className="py-3 px-3">{user.standard}</td>
                  <td className="py-3 px-3">{user.state}</td>

                  {/* ✅ Consistent time */}
                  <td className="py-3 px-3 text-gray-400">{formatTime()}</td>

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
                <td
                  colSpan="10"
                  className="py-6 text-center text-gray-500 text-sm"
                >
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
