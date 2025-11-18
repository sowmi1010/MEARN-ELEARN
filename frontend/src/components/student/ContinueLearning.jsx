// src/components/student/ContinueLearning.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ContinueLearning({ selectedCourse }) {
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLastWatched() {
      if (!selectedCourse) {
        setItem(null);
        return;
      }

      // Try backend endpoint for last watched video per course (preferred)
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get(`/progress/last-watched`, { headers, params: { courseId: selectedCourse._id }});
        if (res.data && res.data.video) {
          setItem({
            title: res.data.video.title,
            duration: res.data.video.duration || "—",
            lessonsCount: res.data.courseLessonsCount || 0,
            course: selectedCourse,
            videoId: res.data.video._id,
          });
          return;
        }
      } catch (err) {
        // ignore and fallback to videos list
      }

      // Fallback: fetch first video for course (or any)
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const vRes = await api.get("/videos", { headers, params: { course: selectedCourse._id, limit: 1 }});
        const videos = Array.isArray(vRes.data) ? vRes.data : vRes.data.videos || [];
        if (videos.length) {
          setItem({
            title: videos[0].title,
            duration: videos[0].duration || "—",
            lessonsCount: videos.length,
            course: selectedCourse,
            videoId: videos[0]._id,
          });
        } else {
          setItem(null);
        }
      } catch (err) {
        console.warn("ContinueLearning fallback failed", err);
        setItem(null);
      }
    }

    loadLastWatched();
  }, [selectedCourse]);

  if (!selectedCourse) {
    return (
      <div className="bg-[#081024] p-4 rounded-xl shadow-lg text-gray-300">
        <h3 className="font-semibold mb-2">Continue Learning</h3>
        <p className="text-sm">Purchase a course to see learning content here.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#081024] p-4 rounded-xl shadow-lg text-gray-200">
      <h3 className="font-semibold mb-4">Continue Learning — {selectedCourse.title}</h3>

      {item ? (
        <div className="flex items-center gap-4">
          <div className="w-20 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md flex items-center justify-center text-sm font-semibold">
            {item.lessonsCount}L
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{item.title}</div>
            <div className="text-sm text-gray-400">{item.duration} • {item.lessonsCount} lessons</div>
          </div>
          <div>
            <button onClick={() => navigate(`/student/videos?course=${selectedCourse._id}&video=${item.videoId}`)} className="bg-purple-600 px-4 py-2 rounded">Resume</button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">No recent progress found for this course.</div>
      )}
    </div>
  );
}
