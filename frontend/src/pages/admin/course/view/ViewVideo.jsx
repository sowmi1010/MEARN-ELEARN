import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { FaArrowLeft, FaRegPlayCircle } from "react-icons/fa";

export default function ViewVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:4000";

  const handlePath = (p) => {
    if (!p) return "";
    const clean = p.replace(/\\/g, "/").replace(/^.*uploads\//, "uploads/");
    return clean.startsWith("http") ? clean : `${BASE}/${clean}`;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white text-xl">
        Loading Video...
      </div>
    );

  if (!video)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-[#020617] text-xl">
        Video not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white px-6 py-10">
      {/* MAIN WRAPPER */}
      <div
        className="
        max-w-6xl mx-auto
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-3xl p-8 
        shadow-2xl shadow-cyan-900/30
        grid md:grid-cols-3 gap-8
      "
      >
        {/* LEFT — VIDEO CONTENT */}
        <div className="md:col-span-2 space-y-6">
          {/* TITLE */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-cyan-400 drop-shadow">
            <FaRegPlayCircle /> {video.title}
          </h1>

          {/* PLAYER */}
          <video
            controls
            src={handlePath(video.file)}
            className="
              w-full h-[420px] rounded-xl 
              border border-cyan-400/20 
              bg-black shadow-xl shadow-black/40
            "
          />

          {/* DESCRIPTION */}
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-cyan-300 mb-1">
              About Video
            </h3>
            <p className="text-gray-300">
              {video.aboutCourse || "No description provided"}
            </p>
          </div>
        </div>

        {/* RIGHT — INFO PANEL */}
        <div
          className="
          space-y-5 
          bg-black/40 p-6 rounded-xl 
          border border-white/10 
          shadow-lg shadow-black/30
        "
        >
          {/* THUMBNAIL */}
          {video.thumbnail && (
            <img
              src={handlePath(video.thumbnail)}
              alt="Thumbnail"
              className="
                w-full h-44 object-cover mb-4 
                rounded-xl border border-white/10 
                shadow shadow-black/40
              "
            />
          )}

          <Info label="Group" value={video.group} />
          <Info label="Standard" value={video.standard} />
          <Info label="Board" value={video.board} />
          <Info label="Language" value={video.language} />
          <Info label="Subject" value={video.subject} />
          <Info label="Lesson" value={video.lesson} />
          <Info label="Category" value={video.category} />
          <Info label="Video No" value={video.videoNumber} />
        </div>
      </div>
    </div>
  );
}

/* ============================
   SMALL INFO ROW COMPONENT
============================= */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-cyan-300 mt-1">{value || "-"}</p>
  </div>
);
