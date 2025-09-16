import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch user info (decode JWT on backend in future)
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const resCourses = await api.get("/courses");
        setCourses(resCourses.data);

        // Quick hack: read user from localStorage (in production, create /me API)
        const stored = JSON.parse(atob(token.split(".")[1]));
        setUser(stored);
      } catch (err) {
        navigate("/login");
      }
    }
    fetchData();
  }, [navigate]);

  if (!user) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">Dashboard</h1>

      {user.role === "student" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses
              .filter((c) => c.enrolledStudents?.includes(user.id))
              .map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/course/${c._id}`)}
                  className="bg-darkCard p-4 rounded-lg cursor-pointer hover:scale-105 transition"
                >
                  <h3 className="text-lg text-accent font-semibold">{c.title}</h3>
                  <p className="text-gray-400">{c.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {user.role === "admin" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Courses</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.post("/courses", newCourse);
                alert("Course created!");
                window.location.reload();
              } catch (err) {
                alert("Error creating course");
              }
            }}
            className="bg-darkCard p-6 rounded-lg shadow-lg mb-6"
          >
            <h3 className="text-lg font-bold text-accent mb-4">Create New Course</h3>
            <input
              type="text"
              placeholder="Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="w-full mb-3 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
            />
            <input
              type="text"
              placeholder="Slug (unique)"
              value={newCourse.slug}
              onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
              className="w-full mb-3 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
            />
            <textarea
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full mb-3 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
            />
            <select
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              className="w-full mb-3 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
            >
              <option value="">Select Category</option>
              <option value="1-6">1-6</option>
              <option value="7-10">7-10</option>
              <option value="11-12">11-12</option>
              <option value="FullStack">FullStack</option>
              <option value="AWS">AWS</option>
              <option value="AI-ML">AI-ML</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newCourse.price}
              onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
              className="w-full mb-3 p-3 rounded bg-darkBg border border-gray-700 focus:border-accent outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded bg-accent text-darkBg font-semibold hover:opacity-90 transition"
            >
              Create Course
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Existing Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c._id} className="bg-darkCard p-4 rounded-lg shadow">
                <h3 className="text-lg text-accent font-semibold">{c.title}</h3>
                <p className="text-gray-400">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
