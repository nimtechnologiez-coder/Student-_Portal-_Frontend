import React, { useEffect, useState } from "react";
import "../style/course.css";
import course from "../Images/coursepic 1.png"
import API_BASE_URL from "../config/api";


const Courses = () => {
  const userId = localStorage.getItem("user_id");

  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState({});
  const [topics, setTopics] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ==========================
  // LOAD DATA
  // ==========================
  const loadData = (filter = "") => {
  setLoading(true);

  fetch(
    `${API_BASE_URL}/api/student/course-progress/?user_id=${userId}${filter}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setCourseInfo(data);
        setTopics(data.topics || []);
      }
    })
    .catch(() => console.error("Course progress API error"))
    .finally(() => setLoading(false));
};


  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  // ==========================
  // DATE FILTER
  // ==========================
  const applyFilter = () => {
    let filter = "";
    if (fromDate) filter += `&from_date=${fromDate}`;
    if (endDate) filter += `&end_date=${endDate}`;
    loadData(filter);
  };

  if (loading) return <h2>Loading...</h2>;

  const progress = Math.round(courseInfo.progress || 0);
  const highestScore = Math.round(courseInfo.highest_score || 0);

  return (
    <div className="dash-container">
      {/* ================= HEADER ================= */}
      <div className="dash-header">
        <div className="dash-header-left">
          <h2>Welcome back {courseInfo.student}</h2>
          <h3>
            Enhance Your <span className="highlight">Knowledge</span> With Us!
          </h3>
          <p>
            {courseInfo.course} — Batch {courseInfo.batch}
          </p>
        </div>

        <div className="dash-header-right">
          <img
            src={course}
            alt="student"
            className="dash-header-img"
          />
        </div>
      </div>

      {/* ================= DATE FILTER ================= */}
      <div className="date-filter-section">
        <div className="date-input-wrapper">
          <span>From Date</span>
          <input
            type="date"
            className="date-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="date-input-wrapper">
          <span>End Date</span>
          <input
            type="date"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button className="apply-filter-btn" onClick={applyFilter}>
          Apply Filter
        </button>
      </div>

      {/* ================= COURSE CARD ================= */}
      <div className="course-card-wrapper">
        <div className="course-card">
          <div className="card-top">
            <div className="course-icon blue"></div>
            <h4>{courseInfo.course || "Course"}</h4>
          </div>

          <div className="progress-row">
            <p>Progress</p>
            <span>{progress}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill blue-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="trainer-row">
            <p>Trainer</p>
            <div className="trainer-info">
              <p>{topics[0]?.trainer || "Not Assigned"}</p>
              <span>Trainer from academy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
  {/* ================= DESKTOP TABLE ================= */}
<div className="dash-table desktop-only">
  <div className="table-inner">
    <div className="table-header">
      <p>Date</p>
      <p>Topic</p>
      <p>Trainer</p>
      <p>Hours</p>
      <p>Status</p>
      <p>Zoom Link</p>
      <p>Video</p>
    </div>

    {topics.map((row, index) => (
      <div className="table-row" key={index}>
        <p>{row.date}</p>
        <p>{row.topic}</p>
        <p>{row.trainer}</p>
        <p>{row.hours}</p>
        <p>{row.status}</p>
        <p>
          {row.zoom_link && row.zoom_link !== "N/A" ? (
            <a href={row.zoom_link} target="_blank" rel="noreferrer" className="btn-link join-btn">
              Join
            </a>
          ) : "N/A"}
        </p>
        <p>
          {row.video ? (
            <a href={row.video} target="_blank" rel="noreferrer" className="btn-link play-btn">
              Play
            </a>
          ) : "N/A"}
        </p>
      </div>
    ))}
  </div>
</div>

{/* ================= MOBILE CARDS ================= */}
<div className="topic-cards mobile-only">
  {topics.map((row, index) => (
    <div className="topic-card" key={index}>
      <div><span>Date</span><strong>{row.date}</strong></div>
      <div><span>Topic</span><strong>{row.topic}</strong></div>
      <div><span>Trainer</span><strong>{row.trainer}</strong></div>
      <div><span>Hours</span><strong>{row.hours}</strong></div>
      <div><span>Status</span><strong>{row.status}</strong></div>

      <div className="card-actions">
        {row.zoom_link && row.zoom_link !== "N/A" && (
          <a href={row.zoom_link} target="_blank" rel="noreferrer" className="btn-link join-btn">
            Join Zoom
          </a>
        )}
        {row.video && (
          <a href={row.video} target="_blank" rel="noreferrer" className="btn-link play-btn">
            Play Video
          </a>
        )}
      </div>
    </div>
  ))}
</div>


      {/* ================= PERFORMANCE ================= */}
      <div className="performance-box">
        <h3 className="performance-title">Overall Performance Score</h3>

        <div className="performance-row">
          <div className="performance-col">
            <div className="progress-bar">
              <div
                className="progress-fill purple"
                style={{ width: `${highestScore}%` }}
              ></div>
            </div>
            <p>Highest Score — {highestScore}%</p>
          </div>

          <div className="performance-col">
            <div className="progress-bar">
              <div
                className="progress-fill purple"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>Progress — {progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
