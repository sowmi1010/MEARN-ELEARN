import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function VideoPlayer({ videoId }) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/videos/stream/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ backend should return signed streamable URL
        setVideoUrl(res.data.url);
      } catch (err) {
        alert("❌ Not authorized to watch this video");
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
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
        key={videoUrl} // ✅ force reload when URL changes
        src={videoUrl}
        controls
        playsInline
        className="w-full max-h-[500px] object-contain"
      />
    </div>
  );
}
