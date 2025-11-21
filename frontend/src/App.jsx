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
  import("./pages/student/StudentDashboard")
);

const Videos = React.lazy(() => import("./pages/student/Videos"));
const VideoPlayer = React.lazy(() => import("./pages/student/VideoPlayer"));
const Books = React.lazy(() => import("./pages/student/Books"));
const BookViewer = React.lazy(() => import("./pages/student/BookViewer"));
const Notes = React.lazy(() => import("./pages/student/Notes"));
const NoteViewer = React.lazy(() => import("./pages/student/NoteViewer"));
const Tests = React.lazy(() => import("./pages/student/Test"));
const TestViewer = React.lazy(() => import("./pages/student/TestViewer"));
const Quiz = React.lazy(() => import("./pages/student/Quiz"));
const QuizPlayer = React.lazy(() => import("./pages/student/QuizPlayer"));
const QuizResult = React.lazy(() => import("./pages/student/QuizResult"));
const Live = React.lazy(() => import("./pages/student/Live"));
const TodoList = React.lazy(() => import("./pages/student/TodoList"));
const AddTodo = React.lazy(() => import("./pages/student/AddTodo"));
const Marks = React.lazy(() => import("./pages/student/Marks"));
const Courses = React.lazy(() => import("./pages/student/Courses"));
const Certificate = React.lazy(() => import("./pages/student/Certificate"));
const ViewCertificate = React.lazy(() =>
  import("./pages/student/ViewCertificate")
);
const StudentTeam = React.lazy(() => import("./pages/student/StudentTeam"));
const ChatWindowPage = React.lazy(() => import("./pages/student/ChatWindow"));
const StudentProfile = React.lazy(() =>
  import("./pages/student/ProfileSetting")
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
const CourseSubjects = React.lazy(() =>
  import("./pages/admin/course/CourseSubjects")
);
const CourseCategories = React.lazy(() =>
  import("./pages/admin/course/CourseCategories")
);
const CourseContents = React.lazy(() =>
  import("./pages/admin/course/CourseContents")
);

const AddVideo = React.lazy(() => import("./pages/admin/course/add/AddVideo"));
const AddBook = React.lazy(() => import("./pages/admin/course/add/AddBook"));
const AddNotes = React.lazy(() => import("./pages/admin/course/add/AddNotes"));
const AddTest = React.lazy(() => import("./pages/admin/course/add/AddTest"));
const AddQuiz = React.lazy(() => import("./pages/admin/course/add/AddQuiz"));

const ManageVideos = React.lazy(() =>
  import("./pages/admin/course/manage/ManageVideos")
);
const ManageNotes = React.lazy(() =>
  import("./pages/admin/course/manage/ManageNotes")
);
const ManageTests = React.lazy(() =>
  import("./pages/admin/course/manage/ManageTests")
);

const EditVideo = React.lazy(() =>
  import("./pages/admin/course/edit/EditVideo")
);
const EditNotes = React.lazy(() =>
  import("./pages/admin/course/edit/EditNotes")
);
const EditTests = React.lazy(() =>
  import("./pages/admin/course/edit/EditTests")
);

const ViewVideo = React.lazy(() =>
  import("./pages/admin/course/view/ViewVideo")
);
const ViewNotes = React.lazy(() =>
  import("./pages/admin/course/view/ViewNotes")
);
const ViewTest = React.lazy(() =>
  import("./pages/admin/course/view/ViewTests")
);

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

          <Route
            path="/student/team/chat/:chatId"
            element={<ChatWindowPage />}
          />
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
          <Route index element={<AdminHomePage />} />
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
          <Route
            path="courses/:groupId/subjects"
            element={<CourseSubjects />}
          />
          <Route
            path="courses/:groupId/:subject/categories"
            element={<CourseCategories />}
          />
          <Route
            path="courses/:groupId/:subject/:category/contents"
            element={<CourseContents />}
          />

          {/* ADD */}
          <Route path="courses/add-video" element={<AddVideo />} />
          <Route path="courses/add-book" element={<AddBook />} />
          <Route path="courses/add-notes" element={<AddNotes />} />
          <Route path="courses/add-test" element={<AddTest />} />
          <Route path="courses/add-quiz" element={<AddQuiz />} />

          {/* MANAGE */}
          <Route path="courses/manage-videos" element={<ManageVideos />} />
          <Route path="courses/manage-notes" element={<ManageNotes />} />
          <Route path="courses/manage-tests" element={<ManageTests />} />

          {/* EDIT */}
          <Route path="courses/edit/video/:id" element={<EditVideo />} />
          <Route path="courses/edit/notes/:id" element={<EditNotes />} />
          <Route path="courses/edit/test/:id" element={<EditTests />} />

          {/* VIEW */}
          <Route path="courses/view/video/:id" element={<ViewVideo />} />
          <Route path="courses/view/notes/:id" element={<ViewNotes />} />
          <Route path="courses/view/test/:id" element={<ViewTest />} />

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
