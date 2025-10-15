import React from "react";

export default function RecentPayments({ payments }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Recent Payments</h2>

      {payments.length === 0 ? (
        <p className="text-gray-400">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="p-3">User</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(-5).reverse().map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                >
                  <td className="p-3">{p.user?.name || "Unknown"}</td>
                  <td className="p-3">{p.course?.title || "N/A"}</td>
                  <td className="p-3 text-green-400 font-semibold">₹{p.amount}</td>
                  <td className="p-3 text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
