import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get(`/courses/${id}`, { headers });
      setCourse(res.data);

      const user = JSON.parse(localStorage.getItem("user"));
      const enrolled = res.data.enrolledStudents.some(
        (s) => s._id === user._id
      );
      setIsEnrolled(enrolled);
    } catch (err) {
      console.error("Failed to load course", err);
    }
  }

  async function enrollNow() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await api.post(`/courses/${id}/enroll`, {}, { headers });
      alert("Enrolled Successfully!");
      setIsEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll");
    }
  }

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-2 text-purple-400">
        {course.title}
      </h1>

      <p className="text-gray-400 mb-2">
        Category: {course.category}
      </p>
      <p className="text-gray-400 mb-4">
        Teacher: {course.teacher?.name}
      </p>

      <p className="text-gray-300 mb-6">{course.description}</p>

      {!isEnrolled ? (
        <button
          className="bg-purple-600 px-6 py-3 rounded text-white"
          onClick={enrollNow}
        >
          {course.price === 0 ? "Enroll for Free" : `Buy Course – ₹${course.price}`}
        </button>
      ) : (
        <button className="bg-green-600 px-6 py-3 rounded text-white">
          Enrolled ✓
        </button>
      )}

      {/* VIDEOS LIST */}
      {isEnrolled && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Course Lessons</h2>

          {course.videos.length === 0 && (
            <p className="text-gray-500">No videos yet.</p>
          )}

          <div className="space-y-4">
            {course.videos.map((v) => (
              <div
                key={v._id}
                className="bg-[#0f172a] p-4 rounded cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="text-gray-400">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
