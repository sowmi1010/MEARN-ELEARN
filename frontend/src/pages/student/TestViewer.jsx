import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function TestViewer() {
  const { id } = useParams();
  const [test, setTest] = useState(null);

  useEffect(() => {
    async function loadTest() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get(`/tests/${id}`, { headers });
        setTest(res.data);
      } catch (err) {
        console.error("Failed to load test:", err);
      }
    }
    loadTest();
  }, [id]);

  if (!test) return <div className="p-6 text-white">Loading test...</div>;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-2xl font-bold text-purple-400 mb-4">{test.title}</h1>

      <iframe
        src={`${BASE_URL}/${test.file}`}
        className="w-full h-[90vh] rounded-lg bg-black"
        title="Test Viewer"
      ></iframe>

      <a
        href={`${BASE_URL}/${test.file}`}
        download
        className="mt-4 inline-block bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
      >
        Download Test
      </a>
    </div>
  );
}
