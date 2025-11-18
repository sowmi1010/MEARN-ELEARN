import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const loadTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await api.get("/todos", { headers });

      setTodos(res.data.todos);
      setCompleted(res.data.completed);
      setRemaining(res.data.remaining);
    } catch (err) {
      console.error("Load Todos Error:", err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Toggle complete
  const toggleTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await api.put(`/todos/toggle/${id}`, {}, { headers });
      loadTodos();
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  // Delete
  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await api.delete(`/todos/${id}`, { headers });
      loadTodos();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#0A0F1F] text-white">
      
      <div className="flex justify-between mb-6">
        <div className="bg-purple-900 px-6 py-3 rounded-xl text-lg font-bold">
          Completed To-Do: <span className="text-yellow-300">{completed}</span>
        </div>

        <div className="bg-blue-900 px-6 py-3 rounded-xl text-lg font-bold">
          Remaining To-Do: <span className="text-yellow-300">{remaining}</span>
        </div>

        <Link
          to="/student/todo/add"
          className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg"
        >
          + Add New
        </Link>
      </div>

      <div className="bg-[#0F1629] p-6 rounded-xl">
        {todos.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-4 border-b border-gray-700"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleTodo(item._id)}
                className="w-5 h-5"
              />
              <p className={`${item.completed ? "line-through text-gray-400" : ""}`}>
                {item.text}
                <br />
                <span className="text-sm text-gray-500">
                  {item.date} {item.month} {item.year}
                </span>
              </p>
            </div>

            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => deleteTodo(item._id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
