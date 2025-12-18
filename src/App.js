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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 NO SIDEBAR */}
        <Route path="/" element={<Login />} />

        {/* 🔐 SIDEBAR PAGES */}
        <Route
          path="/student-dashboard"
          element={<Layout><StudentDashboard /></Layout>}
        />

        <Route
          path="/course"
          element={<Layout><Course /></Layout>}
        />

        <Route
          path="/attendancedashboard"
          element={<Layout><AttendanceDashboard /></Layout>}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/student/task-log"
          element={<Layout><StudentTaskLog /></Layout>}
        />

        <Route
          path="/settings"
          element={<Layout><Settings /></Layout>}
        />

        <Route
          path="/payment"
          element={<Layout><Payment /></Layout>}
        />

         <Route
          path="/chat"
          element={<Layout>
            <ChatPage/>
          </Layout>}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
