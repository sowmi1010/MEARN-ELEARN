import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function TopCoursesChart({ courses }) {
  const data = courses
    .slice(0, 6)
    .map((c) => ({
      name: c.title || "Untitled",
      enrollments: c.enrolledUsers ? c.enrolledUsers.length : 0,
    }));

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Top Courses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis type="number" stroke="#bbb" />
          <YAxis dataKey="name" type="category" stroke="#bbb" width={120} />
          <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }} />
          <Bar dataKey="enrollments" fill="#10b981" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
