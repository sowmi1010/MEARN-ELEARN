import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/auth/PrivateRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// ⭐ Public Pages
import CourseGroupsPage from "./pages/courses/CourseGroupsPage";
import GroupDetailPage from "./pages/courses/GroupDetailPage";
import PaymentPage from "./pages/payments/PaymentPage";
import PaymentSuccess from "./pages/payments/PaymentSuccess";

// 🔹 Lazy load pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyCode = React.lazy(() => import("./pages/auth/VerifyCode"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

const LandingPage = React.lazy(() => import("./pages/landing/LandingPage"));

// 🔹 STUDENT
const StudentLayout = React.lazy(() => import("./layouts/StudentLayout"));

const StudentDashboard = React.lazy(() =>
  import("./pages/student/dashboard/StudentDashboard")
);

const Videos = React.lazy(() => import("./pages/student/contents/Videos"));
const VideoPlayer = React.lazy(() =>
  import("./pages/student/contents/VideoPlayer")
);
const Books = React.lazy(() => import("./pages/student/contents/Books"));
const BookViewer = React.lazy(() =>
  import("./pages/student/contents/BookViewer")
);
const Notes = React.lazy(() => import("./pages/student/contents/Notes"));
const NoteViewer = React.lazy(() =>
  import("./pages/student/contents/NoteViewer")
);
const Tests = React.lazy(() => import("./pages/student/contents/Test"));
const TestViewer = React.lazy(() =>
  import("./pages/student/contents/TestViewer")
);
const Quiz = React.lazy(() => import("./pages/student/contents/Quiz"));
const QuizPlayer = React.lazy(() =>
  import("./pages/student/contents/QuizPlayer")
);
const QuizResult = React.lazy(() =>
  import("./pages/student/contents/QuizResult")
);
const Live = React.lazy(() => import("./pages/student/learning/Live"));
const TodoList = React.lazy(() =>
  import("./pages/student/productivity/TodoList")
);
const AddTodo = React.lazy(() =>
  import("./pages/student/productivity/AddTodo")
);
const Marks = React.lazy(() => import("./pages/student/performance/Marks"));
const Courses = React.lazy(() => import("./pages/student/courses/Courses"));
const Certificate = React.lazy(() =>
  import("./pages/student/learning/Certificate")
);
const ViewCertificate = React.lazy(() =>
  import("./pages/student/learning/ViewCertificate")
);
const StudentTeam = React.lazy(() =>
  import("./pages/student/community/StudentTeam")
);
const StudentProfile = React.lazy(() =>
  import("./pages/student/profile/ProfileSetting")
);

// 🔹 ADMIN
const AdminLayout = React.lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPayments = React.lazy(() =>
  import("./pages/admin/payment/AdminPayments")
);

const AdminList = React.lazy(() =>
  import("./pages/admin/adminUsers/AdminList")
);
const AdminDetailsUpload = React.lazy(() =>
  import("./pages/admin/adminUsers/AdminDetailsUpload")
);

const StudentList = React.lazy(() =>
  import("./pages/admin/students/StudentList")
);
const AddStudent = React.lazy(() =>
  import("./pages/admin/students/AddStudent")
);
const AboutStudent = React.lazy(() =>
  import("./pages/admin/students/AboutStudent")
);

const AdminHomePage = React.lazy(() => import("./pages/admin/AdminHomePage"));

const TeacherUpload = React.lazy(() =>
  import("./pages/admin/teachers/TeacherUpload")
);
const FeedbackUpload = React.lazy(() =>
  import("./pages/admin/feedbacks/FeedbackUpload")
);

const MentorList = React.lazy(() => import("./pages/admin/mentor/MentorList"));
const MentorUpload = React.lazy(() =>
  import("./pages/admin/mentor/MentorUpload")
);
const MentorAccess = React.lazy(() =>
  import("./pages/admin/mentor/MentorAccess")
);

// 🔹 ADMIN COURSE PAGES
const CourseHome = React.lazy(() => import("./pages/admin/course/CourseHome"));

const ContentManager = React.lazy(() =>
  import("./pages/admin/course/ContentManager")
);

const VideoForm = React.lazy(() =>
  import("./pages/admin/course/form/VideoForm")
);

const BookForm = React.lazy(() => import("./pages/admin/course/form/BookForm"));
const NotesForm = React.lazy(() =>
  import("./pages/admin/course/form/NotesForm")
);
const TestForm = React.lazy(() => import("./pages/admin/course/form/TestForm"));

const QuizForm = React.lazy(() => import("./pages/admin/course/form/QuizForm"));

const ViewVideo = React.lazy(() =>
  import("./pages/admin/course/view/ViewVideo")
);
const ViewNotes = React.lazy(() =>
  import("./pages/admin/course/view/ViewNotes")
);
const ViewTest = React.lazy(() =>
  import("./pages/admin/course/view/ViewTests")
);

const ViewBook = React.lazy(() => import("./pages/admin/course/view/ViewBook"))

const ViewQuiz = React.lazy(() => import("./pages/admin/course/view/ViewQuiz"))

// 🔹 CHAT
import ChatList from "./pages/admin/chat/ChatList";
import ChatWindow from "./pages/admin/chat/ChatWindow";

// ✨ Animation Wrapper
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
        {/* ⭐ PUBLIC ROUTES */}
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

        {/* ⭐ Course Group Public */}
        <Route
          path="/courses"
          element={
            <PageWrapper>
              <CourseGroupsPage />
            </PageWrapper>
          }
        />
        <Route
          path="/courses/:groupName"
          element={
            <PageWrapper>
              <GroupDetailPage />
            </PageWrapper>
          }
        />

        {/* ⭐ Payment */}
        <Route
          path="/payment/:courseId"
          element={
            <PageWrapper>
              <PaymentPage />
            </PageWrapper>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PageWrapper>
              <PaymentSuccess />
            </PageWrapper>
          }
        />

        {/* ⭐ AUTH ROUTES */}
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

        {/* ================= STUDENT ROUTES ================= */}
        <Route
          path="/student"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <StudentLayout />
            </Suspense>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="videos" element={<Videos />} />
          <Route path="video/:id" element={<VideoPlayer />} />
          <Route path="books" element={<Books />} />
          <Route path="books/view/:id" element={<BookViewer />} />
          <Route path="notes" element={<Notes />} />
          <Route path="notes/view/:id" element={<NoteViewer />} />
          <Route path="tests" element={<Tests />} />
          <Route path="tests/view/:id" element={<TestViewer />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="quiz/play/:id" element={<QuizPlayer />} />
          <Route path="quiz/result" element={<QuizResult />} />
          <Route path="live" element={<Live />} />
          <Route path="todo" element={<TodoList />} />
          <Route path="todo/add" element={<AddTodo />} />
          <Route path="marks" element={<Marks />} />
          <Route path="courses" element={<Courses />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="certificate/view/:id" element={<ViewCertificate />} />
          <Route path="/student/team" element={<StudentTeam />} />

         <Route path="/student/team/:userId" element={<ChatWindow />} />
         

          <Route path="/student/settings" element={<StudentProfile />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRoles={["admin", "mentor"]}>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLayout />
              </Suspense>
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHomePage />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="payments" element={<AdminPayments />} />

          {/* ADMINS */}
          <Route path="admins" element={<AdminList />} />
          <Route path="admins/new" element={<AdminDetailsUpload />} />
          <Route path="admins/edit/:id" element={<AdminDetailsUpload />} />

          {/* STUDENTS */}
          <Route path="students" element={<StudentList />} />
          <Route path="students/new" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<AddStudent />} />
          <Route path="students/details/:id" element={<AboutStudent />} />

          {/* MENTORS */}
          <Route path="mentors" element={<MentorList />} />
          <Route path="mentors/new" element={<MentorUpload />} />
          <Route path="mentors/edit/:id" element={<MentorUpload />} />
          <Route path="mentor-access/:id" element={<MentorAccess />} />

          {/* TEACHER */}
          <Route path="teachers/new" element={<TeacherUpload />} />

          {/* FEEDBACK */}
          <Route path="feedbacks/new" element={<FeedbackUpload />} />

          {/* COURSES */}
          <Route path="courses" element={<CourseHome />} />

          <Route path="courses/:groupId/manage" element={<ContentManager />} />

          {/* VIDEO FORM (ADD + EDIT) */}
          <Route path="courses/add-video" element={<VideoForm />} />
          <Route path="courses/videos/edit/:id" element={<VideoForm />} />
          <Route path="courses/add-book" element={<BookForm />} />
          <Route path="courses/books/edit/:id" element={<BookForm />} />
          <Route path="courses/add-notes" element={<NotesForm />} />
          <Route path="courses/notes/edit/:id" element={<NotesForm />} />
          <Route path="courses/add-test" element={<TestForm />} />
          <Route path="courses/tests/edit/:id" element={<TestForm />} />
          <Route path="courses/add-quiz" element={<QuizForm />} />
          <Route path="courses/quiz/edit/:id" element={<QuizForm />} />

          {/* VIEW */}
          <Route path="courses/view/video/:id" element={<ViewVideo />} />
          <Route path="courses/view/note/:id" element={<ViewNotes />} />
          <Route path="courses/view/test/:id" element={<ViewTest />} />
          <Route path="courses/view/book/:id" element={<ViewBook />} />
          <Route path="courses/view/qui/:id" element={< ViewQuiz />} />


          {/* CHAT */}
          <Route path="team" element={<ChatList />} />
          <Route path="team/:userId" element={<ChatWindow />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="dark:bg-darkBg bg-white min-h-screen text-gray-200">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </Router>
  );
}
