import React, { useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

export default function AddTodo() {
  const navigate = useNavigate();

  const [todo, setTodo] = useState({
    text: "",
    date: "",
    month: "",
    year: "",
  });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await api.post("/todos/add", todo, { headers });

      if (res.status === 201) {
        navigate("/student/todo");
      }
    } catch (err) {
      console.error("Add To-Do Error:", err);
      alert("Failed to add To-Do");
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#0A0F1F]">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Add To-Do</h1>

      <div className="bg-[#0F1629] p-6 rounded-xl">

        {/* To-Do Text */}
        <label className="text-gray-300 text-sm">To-Do</label>
        <input
          type="text"
          className="w-full mt-2 p-3 rounded bg-[#1A233A] text-white"
          placeholder="Enter the To-Do"
          onChange={(e) => setTodo({ ...todo, text: e.target.value })}
        />

        {/* Date Row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <select
            className="bg-[#1A233A] p-3 rounded"
            onChange={(e) => setTodo({ ...todo, date: e.target.value })}
          >
            <option>Date</option>
            {[...Array(31).keys()].map((d) => (
              <option key={d + 1}>{d + 1}</option>
            ))}
          </select>

          <select
            className="bg-[#1A233A] p-3 rounded"
            onChange={(e) => setTodo({ ...todo, month: e.target.value })}
          >
            <option>Month</option>
            {[
              "Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"
            ].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            className="bg-[#1A233A] p-3 rounded"
            onChange={(e) => setTodo({ ...todo, year: e.target.value })}
          >
            <option>Year</option>
            {["2024", "2025", "2026"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold"
          onClick={handleSubmit}
        >
          COMPLETE
        </button>
      </div>
    </div>
  );
}
