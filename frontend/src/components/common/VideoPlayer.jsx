import React, { useEffect, useState } from "react";

export default function VideoPlayer({ videoId }) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ Directly set backend stream URL with query token
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    setVideoUrl(`${apiBase}/videos/stream/${videoId}?token=${token}`);
    setLoading(false);
  }, [videoId]);

  if (loading) {
    return (
      <div className="text-gray-400 bg-darkCard p-6 rounded-lg text-center">
        Loading video...
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="text-red-400 bg-darkCard p-6 rounded-lg text-center">
        Video not available
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-2xl mt-6 border border-gray-700">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        playsInline
        className="w-full max-h-[500px] object-contain"
      />
    </div>
  );
}
