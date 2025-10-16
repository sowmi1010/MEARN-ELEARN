import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";

export default function ViewVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileBase = "http://localhost:4000";

  // Helper: normalize + remove "uploads/uploads" or absolute paths
  const cleanPath = (p) => {
    if (!p) return "";
    let normalized = p.replace(/\\/g, "/"); // Convert backslashes
    normalized = normalized.replace(/^.*uploads\//, "uploads/"); // keep only relative part
    return `${fileBase}/${normalized}`;
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
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading video details...
      </div>
    );

  if (!video)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        Video not found
      </div>
    );

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">{video.title}</h1>

        {/* Video player */}
        <div className="flex justify-center mb-6">
          <video
            key={cleanPath(video.file)} // force refresh on new video
            controls
            className="w-full max-w-3xl rounded-lg shadow-md border border-gray-700"
          >
            <source src={cleanPath(video.file)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
          <p><strong>Group:</strong> {video.group}</p>
          <p><strong>Standard:</strong> {video.standard}</p>
          <p><strong>Board:</strong> {video.board}</p>
          <p><strong>Language:</strong> {video.language}</p>
          <p><strong>Subject:</strong> {video.subject}</p>
          <p><strong>Lesson:</strong> {video.lesson}</p>
          <p><strong>Category:</strong> {video.category}</p>
          <p><strong>Video Number:</strong> {video.videoNumber}</p>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {video.aboutCourse || "No description provided."}
          </p>
        </div>

        {/* Thumbnail */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Thumbnail Preview</h3>
          <img
            src={cleanPath(video.thumbnail)}
            alt={video.title}
            className="rounded-lg w-64 mx-auto border border-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
