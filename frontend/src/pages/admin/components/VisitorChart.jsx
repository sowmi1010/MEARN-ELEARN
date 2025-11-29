import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";

export default function VisitorChart({ students = [] }) {

  // =====================================================
  // ✔ Month-wise student registration stats
  // =====================================================
  const data = useMemo(() => {
    if (!Array.isArray(students)) return [];

    const months = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"];

    const count = new Array(12).fill(0);

    students.forEach((s) => {
      const date = s?.createdAt ? new Date(s.createdAt) : null;
      if (!date || isNaN(date)) return;
      const monthIndex = date.getMonth();
      count[monthIndex] += 1;
    });

    return months.map((m, i) => ({
      month: m,
      visitors: count[i],
    }));
  }, [students]);

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
      <h2 className="text-lg font-bold text-blue-400 mb-4">
        👥 Real-Time Student Growth
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          No student data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            
            {/* Glow Fill */}
            <defs>
              <linearGradient id="visitorGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.15)" />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #2563eb",
                color: "#fff",
                fontSize: "13px",
                borderRadius: "10px",
              }}
              formatter={(value) => [`${value} Students`, "New"]}
            />

            {/* Filled area behind line */}
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#3b82f6"
              fill="url(#visitorGlow)"
              fillOpacity={1}
            />

            {/* Main glowing line */}
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#3b82f6", fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
