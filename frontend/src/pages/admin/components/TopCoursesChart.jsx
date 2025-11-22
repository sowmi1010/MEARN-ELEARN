import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TopCoursesChart({ courses = [] }) {

  // ✅ SORT + FORMAT REAL DATA
  const data = useMemo(() => {
    if (!Array.isArray(courses)) return [];

    return courses
      .map((c) => ({
        name: c?.title || "Untitled",
        enrollments: c?.enrolledUsers?.length || 0,
      }))
      .sort((a, b) => b.enrollments - a.enrollments) // ✅ highest first
      .slice(0, 6); // ✅ top 6 only
  }, [courses]);

  return (
    <div
      className="
        bg-[#0e162b]
        p-6
        rounded-2xl
        border border-blue-900/40
        shadow-xl
      "
    >
      <h2 className="text-lg font-bold text-blue-400 mb-5">
        📚 Top Enrolled Courses
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          No course data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
          >
            <defs>
              <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />

            <XAxis
              type="number"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            <YAxis
              dataKey="name"
              type="category"
              stroke="#9ca3af"
              width={160}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "#1e293b" }}
              formatter={(value) => [`${value} Students`, "Enrolled"]}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #2563eb",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "13px",
              }}
            />

            <Bar
              dataKey="enrollments"
              fill="url(#blueGlow)"
              radius={[0, 12, 12, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
