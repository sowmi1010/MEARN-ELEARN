import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";

export default function ViewTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileBase = "http://localhost:4000/";

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const normalize = (p) => (p ? p.replace(/\\/g, "/") : "");

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading test details...
      </div>
    );

  if (!test)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        Test not found
      </div>
    );

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ⬅ Back
      </button>

      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold mb-4 text-center">{test.title}</h1>

        <div className="flex justify-center mb-6">
          {test.file && (
            <iframe
              src={`${fileBase}${normalize(test.file)}`}
              title="Test File"
              className="w-full h-[500px] rounded-lg border border-gray-700 shadow-md"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
          <p><strong>🌱 Group:</strong> {test.group}</p>
          <p><strong>🎓 Standard:</strong> {test.standard}</p>
          <p><strong>🏫 Board:</strong> {test.board}</p>
          <p><strong>🌐 Language:</strong> {test.language}</p>
          <p><strong>📘 Subject:</strong> {test.subject}</p>
          <p><strong>📂 Category:</strong> {test.category}</p>
        </div>

        {test.thumbnail && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Thumbnail Preview</h3>
            <img
              src={`${fileBase}${normalize(test.thumbnail)}`}
              alt={test.title}
              className="rounded-lg w-64 mx-auto border border-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}
