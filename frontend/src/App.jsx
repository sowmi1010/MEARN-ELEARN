import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/common/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/student/StudentDashboard"; // student dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import CourseDetail from "./pages/student/CourseDetail";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import AddCourse from "./pages/admin/AddCourse";
import MyCourses from "./pages/student/MyCourses";
import LandingPage from "./pages/landing/LandingPage";
import Courses from "./pages/shared/Courses";
import AdminPayments from "./pages/admin/AdminPayments"; // ✅ new page




// 👇 import your admin pages
import AdminVideos from "./pages/admin/AdminVideos";
import AdminStudents from "./pages/admin/AdminStudents";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <div className="bg-darkBg min-h-screen text-gray-200">
        {/* Show normal Navbar only if not admin */}
        {user?.role !== "admin" && <Navbar />}

        <Routes>
          {/* Public */}
                    {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* ✅ Courses page */}
          <Route path="/courses" element={<Courses />} />

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
                        <Route path="payments" element={<AdminPayments />} /> {/* ✅ new */}

          </Route>

          {/* ✅ Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
