import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function VideoPlayer({ videoId }) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await api.get(`/videos/stream/${videoId}`);
        setVideoUrl(res.data.url);
      } catch (err) {
        alert("Not authorized to watch this video");
      }
    }
    fetchVideo();
  }, [videoId]);

  if (!videoUrl) return <div className="text-gray-400">Loading video...</div>;

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-lg mt-4">
<video controls width="100%">
  <source src={`http://localhost:4000/${video.s3Key}`} type="video/mp4" />
</video>
    </div>
  );
}
