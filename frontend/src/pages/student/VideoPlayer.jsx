import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);

  // Load selected video
  const loadVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.error("Failed to load video", err);
    }
  };

  // Load all related videos (same subject)
  const loadSideVideos = async () => {
    try {
      const res = await api.get("/videos", {
        params: { subject: video?.subject }
      });
      setAllVideos(res.data);
    } catch (err) {
      console.error("Sidebar videos failed", err);
    }
  };

  useEffect(() => {
    loadVideo();
  }, [id]);

  useEffect(() => {
    if (video) loadSideVideos();
  }, [video]);

  if (!video)
    return (
      <div className="text-center text-gray-300 p-10">Loading...</div>
    );

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-gray-100 p-6">

      {/* LEFT SIDE - MAIN VIDEO PLAYER */}
      <div className="flex-1 pr-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-purple-700 px-4 py-2 rounded hover:bg-purple-800"
        >
          ⬅ Back
        </button>

        <h1 className="text-3xl font-bold mb-4 text-purple-400">Videos</h1>

        <video
          src={`http://localhost:4000/${video.file}`}
          controls
          className="w-full rounded-xl mb-4"
          poster={`http://localhost:4000/${video.thumbnail}`}
        />

        {/* VIDEO DETAILS */}
        <h2 className="text-xl font-bold text-white">{video.title}</h2>
        <p className="text-gray-400">
          {video.subject} • {video.lesson}
        </p>

        {/* ABOUT SECTION */}
        <div className="mt-6 bg-[#081024] p-4 rounded-xl border border-purple-700">
          <h3 className="text-xl font-semibold text-purple-300 mb-2">
            About Course
          </h3>
          <p className="text-gray-300 whitespace-pre-line">
            {video.aboutCourse || "No description available."}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - NEXT VIDEOS */}
      <div className="w-80 bg-[#081024] p-4 rounded-xl overflow-y-auto h-[85vh]">
        <h3 className="text-lg font-semibold mb-3 text-purple-300">Next Lessons</h3>

        {allVideos.map((v) => (
          <div
            key={v._id}
            onClick={() => navigate(`/student/video/${v._id}`)}
            className={`p-3 rounded-lg mb-3 cursor-pointer hover:bg-purple-800/20 
                ${v._id === video._id ? "bg-purple-700/30" : "bg-[#0d1325]"}`}
          >
            <div className="flex items-center gap-3">
              <img
                src={`http://localhost:4000/${v.thumbnail}`}
                className="w-20 h-14 rounded object-cover"
              />
              <div>
                <p className="font-bold text-white text-sm">{v.title}</p>
                <p className="text-xs text-gray-400">
                  {v.subject} • {v.lesson}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
