import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const visitorData = [
  { month: "Jan", visitors: 120 },
  { month: "Feb", visitors: 200 },
  { month: "Mar", visitors: 150 },
  { month: "Apr", visitors: 300 },
  { month: "May", visitors: 250 },
];

export default function VisitorChart() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Visitor Insights</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={visitorData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="month" stroke="#bbb" />
          <YAxis stroke="#bbb" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "8px" }}
          />
          <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
