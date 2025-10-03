import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch Course
  useEffect(() => {
    async function fetchCourse() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);

        // Access check
        if (
          user.role === "admin" ||
          (user.role === "mentor" && user.permissions?.includes("videos")) ||
          user?.enrolledCourses?.includes(res.data._id)
        ) {
          setEnrolled(true);
        }
      } catch (err) {
        console.error("❌ Fetch course error:", err.response?.data || err.message);
        alert("Course not found or unauthorized");
      }
    }
    fetchCourse();
  }, [id, user]);

  // Play selected video
  function playVideo(videoId) {
    const token = localStorage.getItem("token");
    const url = `http://localhost:4000/api/videos/stream/${videoId}?token=${token}`;
    setSelectedVideo(videoId);
    setVideoUrl(url);
  }

  // Enroll handler
  async function handleEnroll() {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/courses/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("🎉 Enrolled successfully!");
      setEnrolled(true);

      // Update user in localStorage
      const updatedUser = { ...user };
      updatedUser.enrolledCourses = [
        ...(updatedUser.enrolledCourses || []),
        id,
      ];
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("❌ Enroll error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to enroll");
    }
  }

  if (!course) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* ===== HERO SECTION ===== */}
      <div
        className="
          bg-white dark:bg-darkCard
          p-8 md:p-12 rounded-2xl shadow-xl
          mb-10 transition-colors duration-300
        "
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-900 dark:text-accent">
          {course.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-6 items-center text-lg">
          <span
            className="
              bg-gradient-to-r from-accent to-blue-500 text-darkBg
              px-4 py-1 rounded-full font-semibold shadow
            "
          >
            {course.category}
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            ₹{course.price}
          </span>
        </div>

        {/* Enroll button for students */}
        {!enrolled && user.role === "student" && (
          <button
            onClick={handleEnroll}
            className="
              mt-6 px-8 py-3 rounded-lg
              bg-gradient-to-r from-accent to-blue-500 text-darkBg font-semibold
              shadow hover:scale-[1.03] hover:shadow-lg
              transition-all duration-300
            "
          >
            🚀 Enroll Now (₹{course.price})
          </button>
        )}
      </div>

      {/* ===== VIDEO & PLAYLIST SECTION ===== */}
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
                className="
                  w-full rounded-xl shadow-lg
                  border border-gray-300 dark:border-gray-700
                  bg-black max-h-[520px]
                "
              />
            ) : (
              <div
                className="
                  flex items-center justify-center h-64
                  rounded-xl shadow-inner
                  bg-gray-200 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-600 dark:text-gray-400
                "
              >
                🎬 Select a lesson to start learning
              </div>
            )}
          </div>

          {/* Playlist */}
          <div
            className="
              bg-white dark:bg-darkCard
              rounded-xl shadow-lg p-4
              overflow-y-auto max-h-[520px]
              border border-gray-200 dark:border-gray-700
              transition-colors duration-300
            "
          >
            <h2 className="text-xl font-semibold text-accent mb-4">Lessons</h2>
            {course.videos && course.videos.length > 0 ? (
              <ul className="space-y-3">
                {course.videos.map((video, i) => (
                  <li
                    key={video._id}
                    onClick={() => playVideo(video._id)}
                    className={`
                      cursor-pointer p-3 rounded-lg
                      transition-all duration-300
                      ${
                        selectedVideo === video._id
                          ? "bg-gradient-to-r from-accent to-blue-500 text-darkBg font-semibold shadow"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-accent/20 hover:text-accent"
                      }
                    `}
                  >
                    <p className="text-xs opacity-70">Lesson {i + 1}</p>
                    <h3 className="text-base">{video.title}</h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No videos available yet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400 text-lg">
          🔒 Enroll to unlock all videos.
        </p>
      )}
    </div>
  );
}
