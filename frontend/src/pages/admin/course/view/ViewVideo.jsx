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
    const clean = p.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/")) return `${BASE}${clean}`;
    return `${BASE}/${clean}`;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );

  if (!video)
    return (
      <div className="h-screen flex items-center justify-center text-red-400 bg-black">
        Video not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050813] text-white px-6 py-10">
      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl grid md:grid-cols-3 gap-6">
        {/* VIDEO AREA */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaRegPlayCircle className="text-cyan-400" />
            {video.title}
          </h1>

          <video
            controls
            src={handlePath(video.file)}
            className="w-full rounded-xl border border-cyan-400/20"
          />

          <p className="text-gray-400">
            {video.aboutCourse || "No description provided"}
          </p>
        </div>

        {/* INFO PANEL */}
        <div className="space-y-5 bg-black/30 p-6 rounded-xl border border-white/10">
          <img
            src={handlePath(video.thumbnail)}
            alt="Thumbnail"
            className="w-full h-48 object-cover rounded-lg mb-4 border border-white/10"
          />

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

// SMALL COMPONENT
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "-"}</p>
  </div>
);
