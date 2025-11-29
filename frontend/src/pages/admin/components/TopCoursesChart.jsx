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

  // =====================================================
  // ✔ Prepare clean + sorted + safe chart dataset
  // =====================================================
  const data = useMemo(() => {
    if (!Array.isArray(courses)) return [];

    return courses
      .map((c) => ({
        name: c?.title?.length > 28 ? c.title.slice(0, 28) + "..." : c?.title || "Untitled",
        enrollments: Array.isArray(c?.enrolledUsers)
          ? c.enrolledUsers.length
          : Number(c?.enrolledCount || 0),
      }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 6); // top 6
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
        <ResponsiveContainer width="100%" height={330}>
          <BarChart
            layout="vertical"
            data={data}
            barCategoryGap={20}
            margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
          >
            {/* Blue Glow Gradient */}
            <defs>
              <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
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

            {/* Tooltip */}
            <Tooltip
              cursor={{ fill: "#1e293b" }}
              formatter={(value) => [`${value} Students`, "Enrollments"]}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #2563eb",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "13px",
              }}
            />

            {/* MAIN BAR */}
            <Bar
              dataKey="enrollments"
              fill="url(#blueGlow)"
              radius={[0, 12, 12, 0]}
              barSize={22}
              animationDuration={1000}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
