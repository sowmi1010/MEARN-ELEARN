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

    // ✅ Set backend stream URL with token
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    setVideoUrl(`${apiBase}/videos/stream/${videoId}?token=${token}`);
    setLoading(false);
  }, [videoId]);

  if (loading) {
    return (
      <div
        className="
          p-6 text-center rounded-lg
          bg-gray-100 dark:bg-darkCard
          text-gray-600 dark:text-gray-300
          shadow-md border border-gray-200 dark:border-gray-700
        "
      >
        ⏳ Loading video...
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div
        className="
          p-6 text-center rounded-lg
          bg-red-50 dark:bg-darkCard
          text-red-600 dark:text-red-400
          shadow-md border border-red-200 dark:border-red-500/50
        "
      >
        ⚠️ Video not available
      </div>
    );
  }

  return (
    <div
      className="
        mt-6 rounded-xl overflow-hidden shadow-lg
        bg-black border border-gray-200 dark:border-gray-700
        transition-colors duration-300
      "
    >
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        playsInline
        className="
          w-full max-h-[520px] object-contain
          bg-black
        "
      />
    </div>
  );
}
