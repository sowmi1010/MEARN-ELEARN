import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function CourseDetail() {
  const { id } = useParams(); // courseId from URL
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);

        // check if user already enrolled
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.enrolledCourses?.includes(res.data._id)) {
          setEnrolled(true);
        }
      } catch (err) {
        console.error("❌ Fetch course error:", err.response?.data || err.message);
        alert("Course not found or unauthorized");
      }
    }
    fetchCourse();
  }, [id]);

  function playVideo(videoId) {
    const token = localStorage.getItem("token");

    // ✅ Direct stream URL
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

      alert("✅ Enrolled successfully!");
      setEnrolled(true);

      // update user in localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.enrolledCourses = [...(user.enrolledCourses || []), id];
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("❌ Enroll error:", err.response?.data || err.message);
      alert("Failed to enroll");
    }
  }

  if (!course) return <div className="p-6 text-gray-400">Loading course...</div>;

  return (
    <div className="p-6">
      {/* Course Info */}
      <div className="bg-darkCard p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-accent">{course.title}</h1>
        <p className="mt-2 text-gray-400">{course.description}</p>
        <p className="mt-3 text-gray-300">Category: {course.category}</p>
        <p className="mt-1 text-gray-300">Price: ₹{course.price}</p>

        {/* ✅ Enroll button (only if not enrolled) */}
        {!enrolled && (
          <button
            onClick={handleEnroll}
            className="mt-4 px-6 py-2 bg-accent text-darkBg rounded-lg hover:opacity-90"
          >
            Enroll Now (₹{course.price})
          </button>
        )}
      </div>

      {/* Video List (only visible if enrolled) */}
      {enrolled ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {course.videos && course.videos.length > 0 ? (
            course.videos.map((video) => (
              <div
                key={video._id}
                onClick={() => playVideo(video._id)}
                className={`cursor-pointer p-4 rounded-lg ${
                  selectedVideo === video._id
                    ? "bg-accent text-darkBg"
                    : "bg-darkCard text-gray-300"
                } hover:opacity-90 transition`}
              >
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm">{video.lesson}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No videos yet</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">👉 Enroll to unlock videos.</p>
      )}

      {/* Video Player */}
      {videoUrl && (
        <div className="mt-8">
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            playsInline
            className="w-full rounded-lg border border-gray-700 shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
