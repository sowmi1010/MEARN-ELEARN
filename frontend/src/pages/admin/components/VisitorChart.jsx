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

  // ✅ MONTH-WISE STUDENT COUNTER
  const data = useMemo(() => {
    if (!Array.isArray(students)) return [];

    const months = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"];

    const visits = new Array(12).fill(0);

    students.forEach((s) => {
      if (!s?.createdAt) return;
      const monthIndex = new Date(s.createdAt).getMonth();
      visits[monthIndex] += 1;
    });

    return months.map((m, i) => ({
      month: m,
      visitors: visits[i]
    }));

  }, [students]);


  return (
    <div className="bg-[#0e162b] p-6 rounded-2xl border border-blue-900/40 shadow-xl">
      <h2 className="text-lg font-bold text-blue-400 mb-4">
        Real-Time Student Growth
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>

            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.15)" />

            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #2563eb",
                borderRadius: "10px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorVisitors)"
            />

            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
