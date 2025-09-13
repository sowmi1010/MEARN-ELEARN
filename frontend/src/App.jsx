import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // student dashboard
import AdminDashboard from "./pages/AdminDashboard";
import AdminUpload from "./pages/AdminUpload";
import CourseDetail from "./pages/CourseDetail";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/AdminLayout";
import AddCourse from "./pages/AddCourse";
import MyCourses from "./pages/MyCourses";

// 👇 import your admin pages
import AdminVideos from "./pages/AdminVideos";
import AdminStudents from "./pages/AdminStudents";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <div className="bg-darkBg min-h-screen text-gray-200">
        {/* ✅ Show normal Navbar only if not admin */}
        {user?.role !== "admin" && <Navbar />}

        <Routes>
          {/* ✅ Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Course details (only student) */}
          <Route
            path="/course/:id"
            element={
              <PrivateRoute requiredRole="student">
                <CourseDetail />
              </PrivateRoute>
            }
          />

          {/* ✅ Student Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute requiredRole="student">
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <PrivateRoute requiredRole="student">
                <MyCourses />
              </PrivateRoute>
            }
          />

          {/* ✅ Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="upload" element={<AdminUpload />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="students" element={<AdminStudents />} />
          </Route>

          {/* ✅ Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
