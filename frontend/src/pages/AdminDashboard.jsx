import React, { useEffect, useState } from "react";
import api from "../utils/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res1 = await api.get("/auth/users", { headers });
        setStudents(res1.data);
        const res2 = await api.get("/payments/all", { headers });
        setPayments(res2.data);
      } catch (err) {
        console.error("Admin fetch error:", err);
      }
    }
    fetchData();
  }, []);

  // Dummy chart data (replace with API later)
  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 180 },
    { month: "Mar", visitors: 140 },
    { month: "Apr", visitors: 200 },
    { month: "May", visitors: 160 },
  ];

  return (
    <div className="flex min-h-screen bg-darkBg">

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-darkCard p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-400">Total Users</h3>
            <p className="text-2xl font-bold">{students.length}</p>
          </div>
          <div className="bg-darkCard p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-400">Total Income</h3>
            <p className="text-2xl font-bold">
              ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>
          <div className="bg-darkCard p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-400">Payments</h3>
            <p className="text-2xl font-bold">{payments.length}</p>
          </div>
          <div className="bg-darkCard p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-400">Courses</h3>
            <p className="text-2xl font-bold">4</p> {/* replace with API later */}
          </div>
        </div>

        {/* Visitor Insights Chart */}
        <div className="bg-darkCard p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-accent mb-4">Visitor Insights</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#00d4ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Students Table */}
        <div className="bg-darkCard p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-accent mb-4">Students</h2>
          {students.length === 0 ? (
            <p className="text-gray-400">No students yet</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400">
                  <th className="border-b border-gray-700 p-2">Name</th>
                  <th className="border-b border-gray-700 p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-darkBg/40">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
