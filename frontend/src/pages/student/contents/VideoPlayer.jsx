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
  const currentCardRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* =====================================================
     LOAD VIDEO
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
     LOAD RELATED VIDEOS
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

      const sorted = (res.data || []).sort((a, b) =>
        (a.lesson || "").localeCompare(b.lesson || "")
      );

      setRelatedVideos(sorted);
    } catch (err) {
      console.error("Related videos failed", err);
    }
  };

  /* =====================================================
     LOAD ON ID CHANGE
  ====================================================== */
  useEffect(() => {
    loadVideo();
  }, [id]);

  useEffect(() => {
    if (video) loadRelatedVideos();
  }, [video]);

  /* =====================================================
     AUTO-PLAY NEXT VIDEO
  ====================================================== */
  const handleEnded = () => {
    const i = relatedVideos.findIndex((v) => v._id === video._id);

    if (i !== -1 && i < relatedVideos.length - 1) {
      navigate(`/student/video/${relatedVideos[i + 1]._id}`);
    }
  };

  /* =====================================================
     AUTO-SCROLL TO CURRENT VIDEO IN SIDEBAR
  ====================================================== */
  useEffect(() => {
    if (currentCardRef.current) {
      currentCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [relatedVideos, id]);

  if (loading || !video)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading video...
      </div>
    );

  const videoUrl = `${BASE_URL}/${video.file}`;
  const posterUrl = video.thumbnail ? `${BASE_URL}/${video.thumbnail}` : "";

  /* =====================================================
     UI
  ====================================================== */
  return (
    <div className="min-h-screen bg-[#070610] text-gray-100 flex flex-col lg:flex-row">

      {/* ===========================
          LEFT: MAIN VIDEO SECTION
      ============================ */}
      <div className="flex-1 p-6 pb-20 lg:pb-6">

        {/* Title */}
        <h1 className="text-3xl font-bold text-purple-400 mb-2 drop-shadow">
          {video.title}
        </h1>

        <p className="text-gray-400 mb-6 flex items-center gap-2">
          <span>{video.subject}</span>
          <span className="text-purple-500">•</span>
          <span>{video.lesson}</span>
        </p>

        {/* MAIN PLAYER */}
        <div className="rounded-2xl overflow-hidden border border-purple-900/30 shadow-xl bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            controls
            onEnded={handleEnded}
            className="w-full max-h-[70vh] lg:max-h-[75vh] bg-black"
            controlsList="nodownload"
          />
        </div>

        {/* ABOUT SECTION */}
        <div className="mt-8 p-6 bg-[#0e1120]/80 rounded-2xl border border-purple-900/30 shadow-lg backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-purple-300 mb-3">
            About This Lesson
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {video.description || "No additional description available."}
          </p>
        </div>
      </div>

      {/* ===========================
          RIGHT: RELATED VIDEOS
      ============================ */}
      <aside
        className="
          w-full lg:w-80 
          lg:border-l border-purple-900/40
          bg-[#0b0b15]/80 
          backdrop-blur-xl 
          p-4 
          overflow-y-auto 
          lg:sticky top-0 
          max-h-[40vh] lg:max-h-screen
        "
      >
        <h2 className="text-lg font-bold text-purple-300 mb-4">
          More from {activeSubject}
        </h2>

        {relatedVideos.length === 0 && (
          <p className="text-gray-500 text-sm">No related videos found.</p>
        )}

        <div className="space-y-3">
          {relatedVideos.map((v) => {
            const isActive = v._id === video._id;

            return (
              <div
                key={v._id}
                ref={isActive ? currentCardRef : null}
                onClick={() => navigate(`/student/video/${v._id}`)}
                className={`flex gap-3 p-3 rounded-lg cursor-pointer border transition-all shadow-sm
                  ${
                    isActive
                      ? "bg-purple-700/30 border-purple-500 shadow-purple-500/20"
                      : "bg-[#111827] border-transparent hover:border-purple-600"
                  }
                `}
              >
                <img
                  src={
                    v.thumbnail ? `${BASE_URL}/${v.thumbnail}` : "/default.jpg"
                  }
                  className="w-20 h-14 object-cover rounded-md"
                />

                <div className="flex-1">
                  <p className="font-semibold text-sm leading-tight">
                    {v.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {v.subject} - {v.lesson}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
