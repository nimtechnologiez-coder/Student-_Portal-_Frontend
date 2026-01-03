import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import StudentDashboard from "./components/StudentDashboard";
import Course from "./components/course";
import AttendanceDashboard from "./components/AttendanceDashboard";
import Layout from "./components/Layout";
import StudentTaskLog from "./components/StudentTaskLog";
import Settings from "./components/settings";
import Payment from "./components/Payment";
import ChatPage from "./components/chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* 🔐 PROTECTED */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <Layout><StudentDashboard /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/course"
          element={
            <ProtectedRoute>
              <Layout><Course /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendancedashboard"
          element={
            <ProtectedRoute>
              <Layout><AttendanceDashboard /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/task-log"
          element={
            <ProtectedRoute>
              <Layout><StudentTaskLog /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Layout><Payment /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout><ChatPage /></Layout>
            </ProtectedRoute>
          }
        />

        {/* optional */}
        <Route path="/change-password" element={<ChangePassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
