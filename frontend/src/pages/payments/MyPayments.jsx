import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/payments/my");
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error("Payment load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Payments</h1>

      {payments.length === 0 && <p>No payments found</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((p) => (
          <div
            key={p._id}
            className="shadow-lg p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="font-bold text-xl text-blue-600 dark:text-blue-300">
              {p.course?.title || p.title || "Unknown Course"}
            </h2>

            <p className="text-green-500 font-semibold mt-1">
              ₹ {p.amount || p.price}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-300">
              Status: <span className="font-bold">{p.status}</span>
            </p>

            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              {new Date(p.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
