import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

// LOCAL STORAGE
const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeSubject = localStorage.getItem("activeSubject");

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* =====================================================
     ✅ LOAD CURRENT VIDEO
  ====================================================== */
  const loadVideo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.error("Video load error", err);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     ✅ LOAD RELATED VIDEOS (FILTER FIX)
     Only current subject + group + board + language
  ====================================================== */
  const loadRelatedVideos = async () => {
    try {
      const res = await api.get("/videos", {
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          subject: activeSubject,
        },
      });

      const list = Array.isArray(res.data) ? res.data : [];

      // Sort by lesson name for clean order
      const sorted = list.sort((a, b) =>
        (a.lesson || "").localeCompare(b.lesson || "")
      );

      setRelatedVideos(sorted);
    } catch (err) {
      console.error("Related video load failed", err);
      setRelatedVideos([]);
    }
  };

  /* =====================================================
     LOAD ON CHANGE
  ====================================================== */
  useEffect(() => {
    loadVideo();
  }, [id]);

  useEffect(() => {
    if (video) {
      loadRelatedVideos();
    }
  }, [video]);

  /* =====================================================
     ✅ AUTO PLAY NEXT VIDEO (SAME SUBJECT ONLY)
  ====================================================== */
  const handleEnded = () => {
    const index = relatedVideos.findIndex((v) => v._id === video._id);

    if (index !== -1 && index < relatedVideos.length - 1) {
      const nextVideo = relatedVideos[index + 1];
      navigate(`/student/video/${nextVideo._id}`);
    }
  };

  if (loading || !video)
    return (
      <div className="p-10 text-center text-gray-400">Loading video...</div>
    );

  const videoUrl = `${BASE_URL}/${video.file}`;
  const posterUrl = video.thumbnail
    ? `${BASE_URL}/${video.thumbnail}`
    : "";

  /* =====================================================
     ✅ UI
  ====================================================== */
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-100 flex">

      {/* MAIN VIDEO */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-1">
          {video.title}
        </h1>
        <p className="text-gray-400 mb-5">
          {video.subject} • {video.lesson}
        </p>

        {/* VIDEO PLAYER */}
        <div className="rounded-xl overflow-hidden border border-purple-800/40 shadow-lg">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            poster={posterUrl}
            onEnded={handleEnded}
            className="w-full max-h-[70vh] bg-black"
            controlsList="nodownload"
          />
        </div>

        {/* ABOUT SECTION */}
        <div className="mt-6 bg-[#111827] p-5 rounded-xl border border-purple-800/20">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">
            About this lesson
          </h3>
          <p className="text-gray-300">
            {video.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* ✅ RIGHT SIDE: RELATED VIDEOS (Filtered) */}
      <aside className="w-80 p-4 bg-[#0d0d17] border-l border-purple-900/30 overflow-y-auto sticky top-0 h-screen">
        <h2 className="text-lg font-bold text-purple-300 mb-4">
          More from {activeSubject}
        </h2>

        {relatedVideos.length === 0 && (
          <p className="text-gray-500 text-sm">
            No related videos found.
          </p>
        )}

        <div className="space-y-3">
          {relatedVideos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/student/video/${v._id}`)}
              className={`flex gap-3 p-3 rounded-lg cursor-pointer transition border
                ${
                  v._id === video._id
                    ? "bg-purple-600/30 border-purple-500"
                    : "bg-[#101728] border-transparent hover:border-purple-700"
                }`}
            >
              <img
                src={
                  v.thumbnail
                    ? `${BASE_URL}/${v.thumbnail}`
                    : "/default.jpg"
                }
                className="w-20 h-14 object-cover rounded-md"
              />

              <div>
                <p className="font-semibold text-sm">{v.title}</p>
                <p className="text-xs text-gray-400">
                  {v.subject} – {v.lesson}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
