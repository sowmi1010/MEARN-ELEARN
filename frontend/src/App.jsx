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
import LoadingSpinner from "./components/common/LoadingSpinner";

// Guards
import ProtectedStudent from "./components/auth/ProtectedStudent";
import ProtectedAdmin from "./components/auth/ProtectedAdmin";

/* --------------------------------------------------
   PUBLIC PAGES
-------------------------------------------------- */
import CourseGroupsPage from "./pages/courses/CourseGroupsPage";
import GroupDetailPage from "./pages/courses/GroupDetailPage";
import PaymentPage from "./pages/payments/PaymentPage";
import PaymentSuccess from "./pages/payments/PaymentSuccess";

/* --------------------------------------------------
   AUTH (LAZY)
-------------------------------------------------- */
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyCode = React.lazy(() => import("./pages/auth/VerifyCode"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
const LandingPage = React.lazy(() => import("./pages/landing/LandingPage"));

/* --------------------------------------------------
   STUDENT
-------------------------------------------------- */
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

/* Student Chat Reuse Admin ChatWindow */
const ChatWindow = React.lazy(() =>
  import("./pages/admin/chat/ChatWindow")
);

/* Common */
const ProfileSettings = React.lazy(() =>
  import("./pages/common/ProfileSettings")
);

/* --------------------------------------------------
   ADMIN
-------------------------------------------------- */
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

const StudentListAdmin = React.lazy(() =>
  import("./pages/admin/students/StudentList")
);
const AddStudent = React.lazy(() =>
  import("./pages/admin/students/AddStudent")
);
const AboutStudent = React.lazy(() =>
  import("./pages/admin/students/AboutStudent")
);

const AdminHomePage = React.lazy(() => import("./pages/admin/AdminHomePage"));

const TeacherList = React.lazy(() =>
  import("./pages/admin/teachers/TeacherList")
);
const TeacherAdd = React.lazy(() =>
  import("./pages/admin/teachers/TeacherAdd")
);

const FeedbackList = React.lazy(() =>
  import("./pages/admin/feedbacks/FeedbackList")
);
const FeedbackAdd = React.lazy(() =>
  import("./pages/admin/feedbacks/FeedbackAdd")
);

const MentorList = React.lazy(() => import("./pages/admin/mentor/MentorList"));
const MentorUpload = React.lazy(() =>
  import("./pages/admin/mentor/MentorUpload")
);
const MentorAccess = React.lazy(() =>
  import("./pages/admin/mentor/MentorAccess")
);

/* ADMIN COURSE MANAGER */
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
const ViewBook = React.lazy(() =>
  import("./pages/admin/course/view/ViewBook")
);
const ViewQuiz = React.lazy(() =>
  import("./pages/admin/course/view/ViewQuiz")
);

/* Admin Chat */
const ChatList = React.lazy(() => import("./pages/admin/chat/ChatList"));

/* --------------------------------------------------
   PAGE WRAPPER
-------------------------------------------------- */
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

/* --------------------------------------------------
   ROUTES
-------------------------------------------------- */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* PUBLIC */}
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

        <Route path="/courses" element={<CourseGroupsPage />} />
        <Route path="/courses/:groupName" element={<GroupDetailPage />} />

        <Route path="/payment/:courseId" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* AUTH */}
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/verify-code" element={<PageWrapper><VerifyCode /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />

        {/* STUDENT PROTECTED */}
        <Route element={<ProtectedStudent />}>
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
            <Route path="videos/:subject" element={<Videos />} />
            <Route path="video/:id" element={<VideoPlayer />} />

            <Route path="books" element={<Books />} />
            <Route path="books/:subject" element={<Books />} />
            <Route path="books/view/:id" element={<BookViewer />} />

            <Route path="notes" element={<Notes />} />
            <Route path="notes/:subject" element={<Notes />} />
            <Route path="notes/view/:id" element={<NoteViewer />} />

            <Route path="tests" element={<Tests />} />
            <Route path="tests/:subject" element={<Tests />} />
            <Route path="tests/view/:id" element={<TestViewer />} />

            <Route path="quiz" element={<Quiz />} />
            <Route path="quiz/:subject" element={<Quiz />} />
            <Route path="quiz/play/:id" element={<QuizPlayer />} />
            <Route path="quiz/result" element={<QuizResult />} />

            <Route path="live" element={<Live />} />

            <Route path="todo" element={<TodoList />} />
            <Route path="todo/add" element={<AddTodo />} />

            <Route path="marks" element={<Marks />} />
            <Route path="courses" element={<Courses />} />

            <Route path="certificate" element={<Certificate />} />
            <Route path="certificate/view/:id" element={<ViewCertificate />} />

            <Route path="team" element={<StudentTeam />} />
            <Route path="team/:userId" element={<ChatWindow />} />

            <Route path="settings" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* ADMIN PROTECTED */}
        <Route element={<ProtectedAdmin />}>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<Navigate to="home" replace />} />

            <Route path="home" element={<AdminHomePage />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="payments" element={<AdminPayments />} />

            <Route path="admins" element={<AdminList />} />
            <Route path="admins/new" element={<AdminDetailsUpload />} />
            <Route path="admins/edit/:id" element={<AdminDetailsUpload />} />

            <Route path="students" element={<StudentListAdmin />} />
            <Route path="students/new" element={<AddStudent />} />
            <Route path="students/edit/:id" element={<AddStudent />} />
            <Route path="students/details/:id" element={<AboutStudent />} />

            <Route path="mentors" element={<MentorList />} />
            <Route path="mentors/new" element={<MentorUpload />} />
            <Route path="mentors/edit/:id" element={<MentorUpload />} />
            <Route path="mentor-access/:id" element={<MentorAccess />} />

            <Route path="teachers" element={<TeacherList />} />
            <Route path="teachers/new" element={<TeacherAdd />} />
            <Route path="teachers/edit/:id" element={<TeacherAdd />} />

            <Route path="feedbacks" element={<FeedbackList />} />
            <Route path="feedbacks/new" element={<FeedbackAdd />} />
            <Route path="feedbacks/edit/:id" element={<FeedbackAdd />} />

            <Route path="courses" element={<CourseHome />} />
            <Route path="courses/:groupId/manage" element={<ContentManager />} />

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

            <Route path="courses/view/video/:id" element={<ViewVideo />} />
            <Route path="courses/view/note/:id" element={<ViewNotes />} />
            <Route path="courses/view/test/:id" element={<ViewTest />} />
            <Route path="courses/view/book/:id" element={<ViewBook />} />
            <Route path="courses/view/quiz/:id" element={<ViewQuiz />} />

            <Route path="team" element={<ChatList />} />
            <Route path="team/:userId" element={<ChatWindow />} />

            <Route path="settings" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

/* --------------------------------------------------
   APP ROOT
-------------------------------------------------- */
export default function App() {
  return (
    <Router>
      <div className="dark:bg-darkBg bg-white min-h-screen">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </Router>
  );
}
