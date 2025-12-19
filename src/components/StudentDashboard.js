import React, { useEffect, useState } from "react";
import "../style/StudentDashboard.css";
import herotop from "../Images/image.jpg";
import API_BASE_URL from "../config/api";


const Dashboard = () => {
  const userId = localStorage.getItem("user_id");

  const [profile, setProfile] = useState({});
  const [attendance, setAttendance] = useState(0);
  const [course, setCourse] = useState(0);
  const [taskPercent, setTaskPercent] = useState(0);
  const [weeklyGraph, setWeeklyGraph] = useState([]);

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE_URL}/api/student/dashboard/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfile(data.profile);
          setAttendance(data.attendance_progress);
          setCourse(data.course_progress);
          setTaskPercent(data.task_completion_percent);
          setWeeklyGraph(data.weekly_graph);
        }
      });
  }, [userId]);

  // ===============================
  // WAVE GRAPH PATH (UP / DOWN)
  // ===============================
  const generateWavePath = () => {
    if (!weeklyGraph.length) return "";

    let d = "M 0 90 ";
    let x = 0;

    weeklyGraph.forEach((item) => {
      const y = 90 - item.value * 20; // completed ↑ | pending ↓
      d += `Q ${x + 50} ${y} ${x + 100} 90 `;
      x += 100;
    });

    return d;
  };

  // ===============================
  // DONUT DEGREE CALCULATION
  // ===============================
  const donutDegree = taskPercent * 3.6;

  return (
    <div className="dashboard-container">
      {/* ================= HEADER ================= */}
      <div className="header-section">
        <div className="header-content">
          <div className="header-text">
            <h1>
              Good Morning, <span>{profile.name}</span>
            </h1>
            <p>Check Your Daily Task & schedules</p>
          </div>

          <div className="header-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Course</span>
                <span className="info-value">{profile.course}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Batch</span>
                <span className="info-value">{profile.batch}</span>
              </div>
            </div>

            <div className="header-image">
              <img src={herotop} alt="Student" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="progress-section">
        <div className="progress-card-left">
          {/* Attendance */}
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Attendance Progress</span>
              <span className="progress-percent">{attendance}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${attendance}%` }}
              />
            </div>
          </div>

          {/* Course */}
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Course Progress</span>
              <span className="progress-percent">{course}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${course}%` }}
              />
            </div>
          </div>
        </div>

        {/* ================= DONUT ================= */}
        <div className="donut-card">
          <div
            className="donut"
            style={{
              background: `conic-gradient(
                #c77dff 0deg ${donutDegree}deg,
                #f1e6ff ${donutDegree}deg 360deg
              )`,
            }}
          >
            <div className="donut-inner">
              <h2>{taskPercent}%</h2>
              <p>Task Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TASK REPORT ================= */}
      <div className="task-reports-section">
        <h2 className="section-title">Task Reports</h2>

        <div className="chart-card">
          <button className="chart-badge">Task Reports</button>

          <svg
            className="wave-chart"
            viewBox="0 0 700 180"
            preserveAspectRatio="none"
          >
            <path
              d={generateWavePath()}
              fill="none"
              stroke="#a855f7"
              strokeWidth="3"
            />
          </svg>

          <div className="day-labels">
            {weeklyGraph.map((item, index) => (
              <span key={index}>{item.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="bottom-section">
        <div className="donut-card">
          <div
            className="donut"
            style={{
              background: `conic-gradient(
                #c77dff 0deg ${donutDegree}deg,
                #f1e6ff ${donutDegree}deg 360deg
              )`,
            }}
          >
            <div className="donut-inner">
              <h2>{taskPercent}%</h2>
              <p>Total Modules</p>
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-items">
            <div className="status-item">
              <span className="status-dot completed" />
              <span>Task Completed</span>
            </div>
            <div className="status-item">
              <span className="status-dot not-completed" />
              <span>Task not Completed</span>
            </div>
          </div>

          <a
  href="/student/task-log"
  className="view-details-btn"
  role="button"
>
  <span>View Task Details</span>
  <span>→</span>
</a>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
