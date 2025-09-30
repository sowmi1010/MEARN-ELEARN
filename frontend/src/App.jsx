import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// 🌍 Common Components
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/auth/PrivateRoute";

// 🔑 Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// 🎓 Student Pages
import Dashboard from "./pages/student/StudentDashboard";
import CourseDetail from "./pages/student/CourseDetail";
import MyCourses from "./pages/student/MyCourses";

// 🛠️ Admin Layout + Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import AddCourse from "./pages/admin/AddCourse";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminList from "./pages/admin/AdminList";
import AdminDetailsUpload from "./pages/admin/AdminDetailsUpload";
import StudentList from "./pages/admin/StudentList";
import StudentUpload from "./pages/admin/StudentUpload";
import StudentDetails from "./pages/admin/StudentDetails";
import EnrolledStudentList from "./pages/admin/EnrolledStudentList";

// 🌍 Shared / Landing
import LandingPage from "./pages/landing/LandingPage";
import Courses from "./pages/shared/Courses";

// 👨‍🏫 Mentor Pages
import MentorList from "./pages/admin/MentorList";
import MentorUpload from "./pages/admin/MentorUpload";
import MentorAccess from "./pages/admin/MentorAccess";


// ===========================
// Animation Wrapper
// ===========================
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

// ===========================
// All Routes with Animation
// ===========================
function AnimatedRoutes({ user }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* 🌍 Public Routes */}
        <Route
          path="/"
          element={<PageWrapper><LandingPage /></PageWrapper>}
        />
        <Route
          path="/courses"
          element={<PageWrapper><Courses /></PageWrapper>}
        />
        <Route
          path="/login"
          element={<PageWrapper><Login /></PageWrapper>}
        />
        <Route
          path="/register"
          element={<PageWrapper><Register /></PageWrapper>}
        />

        {/* 🎓 Student Routes */}
        <Route
          path="/course/:id"
          element={
            <PrivateRoute requiredRole="student">
              <PageWrapper><CourseDetail /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="student">
              <PageWrapper><Dashboard /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <PrivateRoute requiredRole="student">
              <PageWrapper><MyCourses /></PageWrapper>
            </PrivateRoute>
          }
        />

        {/* 👨‍🏫 Mentor Direct Routes */}
        <Route
          path="/mentor/students"
          element={
            <PrivateRoute requiredRole="mentor">
              <PageWrapper><EnrolledStudentList /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor/payments"
          element={
            <PrivateRoute requiredRole="mentor">
              <PageWrapper><AdminPayments /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor/videos"
          element={
            <PrivateRoute requiredRole="mentor">
              <PageWrapper><AdminVideos /></PageWrapper>
            </PrivateRoute>
          }
        />

        {/* 🛠️ Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard + Courses */}
          <Route
            path="dashboard"
            element={<PageWrapper><AdminDashboard /></PageWrapper>}
          />
          <Route
            path="upload"
            element={<PageWrapper><AdminUpload /></PageWrapper>}
          />
          <Route
            path="add-course"
            element={<PageWrapper><AddCourse /></PageWrapper>}
          />
          <Route
            path="videos"
            element={<PageWrapper><AdminVideos /></PageWrapper>}
          />
          <Route
            path="payments"
            element={<PageWrapper><AdminPayments /></PageWrapper>}
          />

          {/* Admin Management */}
          <Route
            path="admins"
            element={<PageWrapper><AdminList /></PageWrapper>}
          />
          <Route
            path="admins/new"
            element={<PageWrapper><AdminDetailsUpload /></PageWrapper>}
          />
          <Route
            path="admins/edit/:id"
            element={<PageWrapper><AdminDetailsUpload /></PageWrapper>}
          />

          {/* Student Management */}
          <Route
            path="students"
            element={<PageWrapper><StudentList /></PageWrapper>}
          />
          <Route
            path="students/new"
            element={<PageWrapper><StudentUpload /></PageWrapper>}
          />
          <Route
            path="students/edit/:id"
            element={<PageWrapper><StudentUpload /></PageWrapper>}
          />
          <Route
            path="students/details/:id"
            element={<PageWrapper><StudentDetails /></PageWrapper>}
          />

          {/* Enrolled Students */}
          <Route
            path="enrolled-students"
            element={<PageWrapper><EnrolledStudentList /></PageWrapper>}
          />

          {/* Mentor Management */}
          <Route
            path="mentors"
            element={<PageWrapper><MentorList /></PageWrapper>}
          />
          <Route
            path="mentors/new"
            element={<PageWrapper><MentorUpload /></PageWrapper>}
          />
          <Route
            path="mentors/edit/:id"
            element={<PageWrapper><MentorUpload /></PageWrapper>}
          />
          <Route
            path="mentors/access/:id"
            element={<PageWrapper><MentorAccess /></PageWrapper>}
          />
        </Route>

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

// ===========================
// Main App
// ===========================
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <div className="bg-darkBg min-h-screen text-gray-200">
        {/* Show Navbar only for students & guests */}
        {user?.role !== "admin" && <Navbar />}
        <AnimatedRoutes user={user} />
      </div>
    </Router>
  );
}

export default App;
