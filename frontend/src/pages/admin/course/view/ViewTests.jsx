import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { FaArrowLeft, FaFileAlt } from "react-icons/fa";

export default function ViewTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:4000";

  const getFile = (path) => {
    if (!path) return "";
    const clean = path.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/")) return `${BASE}${clean}`;
    return `${BASE}/${clean}`;
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading Test...
      </div>
    );

  if (!test)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-black">
        Test not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050813] text-white px-6 py-10">

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl grid md:grid-cols-3 gap-6">

        {/* TEST PREVIEW */}
        <div className="md:col-span-2 space-y-5">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaFileAlt className="text-orange-400" />
            {test.title}
          </h1>

          <iframe
            src={getFile(test.file)}
            title="Test Preview"
            className="w-full h-[520px] rounded-xl border border-orange-500/20 bg-black"
          />

        </div>

        {/* INFO PANEL */}
        <div className="space-y-5 bg-black/40 p-6 rounded-xl border border-white/10">

          {test.thumbnail && (
            <img
              src={getFile(test.thumbnail)}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded-lg border border-white/10"
            />
          )}

          <Info label="Group" value={test.group} />
          <Info label="Standard" value={test.standard} />
          <Info label="Board" value={test.board} />
          <Info label="Language" value={test.language} />
          <Info label="Subject" value={test.subject} />
          <Info label="Category" value={test.category} />
        </div>

      </div>
    </div>
  );
}

/* Small info row */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "-"}</p>
  </div>
);
