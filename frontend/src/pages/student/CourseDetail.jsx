import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // ✅ load user once

  useEffect(() => {
    async function fetchCourse() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);

        // ✅ Determine access
        if (
          user.role === "admin" ||
          (user.role === "mentor" && user.permissions?.includes("videos")) ||
          user?.enrolledCourses?.includes(res.data._id)
        ) {
          setEnrolled(true);
        }
      } catch (err) {
        console.error("Fetch course error:", err.response?.data || err.message);
        alert("Course not found or unauthorized");
      }
    }
    fetchCourse();
  }, [id, user]);

  function playVideo(videoId) {
    const token = localStorage.getItem("token");
    const url = `http://localhost:4000/api/videos/stream/${videoId}?token=${token}`;
    setSelectedVideo(videoId);
    setVideoUrl(url);
  }

  async function handleEnroll() {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/courses/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Enrolled successfully!");
      setEnrolled(true);

      // update local user storage
      const updatedUser = { ...user };
      updatedUser.enrolledCourses = [
        ...(updatedUser.enrolledCourses || []),
        id,
      ];
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Enroll error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to enroll");
    }
  }

  if (!course) {
    return <div className="p-6 text-gray-400">Loading course...</div>;
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-darkBg text-gray-200">
      {/* Hero Section */}
      <div className="bg-darkCard p-8 md:p-12 rounded-2xl shadow-xl mb-10">
        <h1 className="text-4xl font-extrabold text-accent mb-3">
          {course.title}
        </h1>
        <p className="text-gray-300 mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-6 items-center text-lg">
          <span className="bg-accent/20 text-accent px-4 py-1 rounded-full">
            {course.category}
          </span>
          <span className="font-semibold text-white">₹{course.price}</span>
        </div>

        {/* ✅ Show Enroll button only for students */}
        {!enrolled && user.role === "student" && (
          <button
            onClick={handleEnroll}
            className="mt-6 px-8 py-3 bg-accent text-darkBg rounded-lg font-semibold shadow hover:opacity-90 transition"
          >
            Enroll Now (₹{course.price})
          </button>
        )}
      </div>

      {/* Video Section */}
      {enrolled ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="md:col-span-2">
            {videoUrl ? (
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                playsInline
                className="w-full rounded-xl border border-gray-700 shadow-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-xl border border-gray-700 text-gray-400">
                Select a lesson to start learning 🎬
              </div>
            )}
          </div>

          {/* Playlist */}
          <div className="bg-darkCard rounded-xl shadow-lg p-4 overflow-y-auto max-h-[500px]">
            <h2 className="text-xl font-semibold text-accent mb-4">Lessons</h2>
            {course.videos && course.videos.length > 0 ? (
              <ul className="space-y-3">
                {course.videos.map((video, i) => (
                  <li
                    key={video._id}
                    onClick={() => playVideo(video._id)}
                    className={`cursor-pointer p-3 rounded-lg transition ${
                      selectedVideo === video._id
                        ? "bg-accent text-darkBg font-semibold"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <p className="text-sm">Lesson {i + 1}</p>
                    <h3 className="text-base">{video.title}</h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No videos yet</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">
          Enroll to unlock all videos.
        </p>
      )}
    </div>
  );
}
