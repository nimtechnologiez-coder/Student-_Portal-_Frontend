import { useEffect, useState } from "react";
import "../style/AttendanceDashboard.css";

export default function Attendance() {
  const userId = localStorage.getItem("user_id");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(
      `http://127.0.0.1:8000/api/student/attendance-dashboard/?user_id=${userId}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          setData(json);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="center">Loading...</p>;
  if (!userId) return <p className="center">User not logged in</p>;
  if (!data) return <p className="center">No data</p>;

  // ================= SAFE DESTRUCTURE =================
  const {
    student = {},
    summary,
    percentages,
    weekly_attendance,
  } = data;

  // ================= DONUT =================
  const successDeg = Math.round(
    (percentages.successful_attendance / 100) * 360
  );

  // ================= CALENDAR (FIXED | SAME UI) =================
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const activeDay = today.getDate();

  const monthName = today.toLocaleString("default", { month: "long" });

  // First day of month (0=Sun)
  const firstDay = new Date(year, month, 1).getDay();

  // Convert to Monday-first
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  return (
    <div className="layout">
      <main className="main">

        {/* ================= HEADER ================= */}
        <div className="header-card">
          <h2>
            Every day counts. Track your <span>attendance</span> and stay on track
          </h2>

          <div className="header-user">
            <img
              src={student.profile_photo || "https://i.imgur.com/QCNbOAo.png"}
              alt="profile"
            />
            <div>
              <strong>{student.name}</strong>

              <div className="header-info">
                <div>
                  <small>Email id</small>
                  <p>{student.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="stats">
          <div className="stat-card">
            <h1>
              <span>{summary.total_attendance}</span>days
            </h1>
            <p>Total Attendance</p>
          </div>

          <div className="stat-card">
            <h1>
              <span>{summary.late_days}</span>days
            </h1>
            <p>Undertime Attendance</p>
          </div>

          <div className="stat-card">
            <h1>
              <span>{summary.absent_days}</span>days
            </h1>
            <p>Total Absent</p>
          </div>
        </div>

        {/* ================= WEEKLY ================= */}
        <div className="weekly">
          <div className="weekly-header">
            <h3>Weekly Attendance Status</h3>

            <div className="legend">
              <div>
                <span className="legend-fill"></span> On Time
              </div>
              <div>
                <span className="legend-outline"></span> Late
              </div>
            </div>
          </div>

          <div className="weekly-bars">
            {weekly_attendance.map((d, i) => (
              <div className="day-col" key={i}>
                <div
                  className={`bar-shell ${
                    d.value === 0 ? "empty" : ""
                  } ${d.day === "SUN" ? "active" : ""}`}
                >
                  {d.value > 0 && (
                    <div
                      className="bar-fill"
                      style={{ height: `${d.value * 100}%` }}
                    />
                  )}
                </div>
                <span>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="bottom">

          {/* DONUT */}
          <div className="donut-card">
            <div
              className="donut"
              style={{
                background: `conic-gradient(
                  #c77dff 0deg ${successDeg}deg,
                  #f1e6ff ${successDeg}deg 360deg
                )`,
              }}
            >
              <div className="donut-inner">
                <h2>{percentages.successful_attendance}%</h2>
                <p>
                  Successful
                  <br />
                  Attendance
                </p>
              </div>
            </div>
          </div>

          {/* PERCENT BOX */}
          <div className="percent-box">
            <div className="percent-row">
              <span>ON TIME</span>
              <strong>{percentages.on_time}%</strong>
            </div>
            <div className="percent-row">
              <span>LATE</span>
              <strong>{percentages.late}%</strong>
            </div>
          </div>

          {/* CALENDAR (SAME UI, FIXED LOGIC) */}
          <div className="calendar-card">
            <h4 className="calendar-title">{monthName}</h4>

            <div className="calendar-week">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </div>

            <div className="calendar-dates">
              {/* Empty slots */}
              {Array.from({ length: startDay }).map((_, i) => (
                <span key={`e-${i}`} className="empty"></span>
              ))}

              {/* Days */}
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                <span
                  key={day}
                  className={day === activeDay ? "active-day" : ""}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
