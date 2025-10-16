// src/App.jsx
import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Common
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/auth/PrivateRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Auth pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyCode = React.lazy(() => import("./pages/auth/VerifyCode"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// Landing
const LandingPage = React.lazy(() => import("./pages/landing/LandingPage"));

// Admin layout + pages
const AdminLayout = React.lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPayments = React.lazy(() => import("./pages/admin/payment/AdminPayments"));
const AdminList = React.lazy(() => import("./pages/admin/adminUsers/AdminList"));
const AdminDetailsUpload = React.lazy(() =>
  import("./pages/admin/adminUsers/AdminDetailsUpload")
);
const StudentList = React.lazy(() => import("./pages/admin/students/StudentList"));
const AddStudent = React.lazy(() => import("./pages/admin/students/AddStudent"));
const AboutStudent = React.lazy(() => import("./pages/admin/students/AboutStudent"));
const TeacherUpload = React.lazy(() => import("./pages/admin/teachers/TeacherUpload"));
const FeedbackUpload = React.lazy(() => import("./pages/admin/feedbacks/FeedbackUpload"));
const MentorList = React.lazy(() => import("./pages/admin/mentor/MentorList"));
const MentorUpload = React.lazy(() => import("./pages/admin/mentor/MentorUpload"));
const MentorAccess = React.lazy(() => import("./pages/admin/mentor/MentorAccess"));

// Course management (admin)
const CourseHome = React.lazy(() => import("./pages/admin/course/CourseHome"));
const CourseSubjects = React.lazy(() =>
  import("./pages/admin/course/CourseSubjects")
);
const CourseContents = React.lazy(() =>
  import("./pages/admin/course/CourseContents")
);
const AddVideo = React.lazy(() => import("./pages/admin/course/add/AddVideo"));
const AddBook = React.lazy(() => import("./pages/admin/course/add/AddBook"));
const AddNotes = React.lazy(() => import("./pages/admin/course/add/AddNotes"));
const AddTest = React.lazy(() => import("./pages/admin/course/add/AddTest"));
const AddQuiz = React.lazy(() => import("./pages/admin/course/add/AddQuiz"));
const ViewNotes = React.lazy(() => import("./pages/admin/course/view/ViewNotes"));
const EditVideo = React.lazy(() => import("./pages/admin/course/edit/EditVideo"));
const ManageVideos = React.lazy(() =>
  import("./pages/admin/course/manage/ManageVideos")
);
const EditNotes = React.lazy(() => import("./pages/admin/course/edit/EditNotes"));
const ViewVideo = React.lazy(() => import("./pages/admin/course/view/ViewVideo"));
const ManageNotes = React.lazy(() =>
  import("./pages/admin/course/manage/ManageNotes")
);
const EditTests = React.lazy(() => import("./pages/admin/course/edit/EditTests"));
const ViewTest = React.lazy(() => import("./pages/admin/course/view/ViewTests"));

// Smooth page transition
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            </Suspense>
          }
        />

        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PageWrapper>
                <Login />
              </PageWrapper>
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PageWrapper>
                <Register />
              </PageWrapper>
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            </Suspense>
          }
        />
        <Route
          path="/verify-code"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PageWrapper>
                <VerifyCode />
              </PageWrapper>
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            </Suspense>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRole="admin">
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLayout />
              </Suspense>
            </PrivateRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="teachers" element={<TeacherUpload />} />
          <Route path="feedbacks" element={<FeedbackUpload />} />
          <Route path="admins" element={<AdminList />} />
          <Route path="admins/new" element={<AdminDetailsUpload />} />
          <Route path="admins/edit/:id" element={<AdminDetailsUpload />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/new" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<AddStudent />} />
          <Route path="students/details/:id" element={<AboutStudent />} />
          <Route path="mentors" element={<MentorList />} />
          <Route path="mentors/new" element={<MentorUpload />} />
          <Route path="mentors/edit/:id" element={<MentorUpload />} />
          <Route path="mentor-access/:id" element={<MentorAccess />} />


          {/* Course management */}
          <Route path="courses" element={<CourseHome />} />
          <Route
            path="courses/:groupId/subjects"
            element={<CourseSubjects />}
          />
          <Route
            path="courses/:groupId/:subject/:category/contents"
            element={<CourseContents />}
          />
          <Route path="courses/add-video" element={<AddVideo />} />
          <Route path="courses/add-book" element={<AddBook />} />
          <Route path="courses/add-notes" element={<AddNotes />} />
          <Route path="courses/add-test" element={<AddTest />} />
          <Route path="courses/add-quiz" element={<AddQuiz />} />
          <Route path="courses/edit/video/:id" element={<EditVideo />} />
          <Route path="courses/view/video/:id" element={<ViewVideo />} />
          <Route path="courses/view/note/:id" element={<ViewNotes />} />
          <Route path="courses/edit/notes/:id" element={<EditNotes />} />
          <Route path="courses/edit/tests/:id" element={<EditTests />} />
          <Route path="courses/view/test/:id" element={<ViewTest />} />
          <Route
            path="courses/:groupId/:subject/:category/videos"
            element={<ManageVideos />}
          />
          <Route
            path="courses/:groupId/:subject/:category/notes"
            element={<ManageNotes />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Listen for login/logout events (Navbar syncs instantly)
useEffect(() => {
  const syncUser = () => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  };
  window.addEventListener("user-login", syncUser);
  window.addEventListener("user-logout", syncUser);
  return () => {
    window.removeEventListener("user-login", syncUser);
    window.removeEventListener("user-logout", syncUser);
  };
}, []);

  return (
    <Router>
      <div className="bg-darkBg min-h-screen text-gray-200">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </Router>
  );
}
