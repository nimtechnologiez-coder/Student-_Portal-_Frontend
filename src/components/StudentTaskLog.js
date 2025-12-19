import React, { useEffect, useState } from "react";
import "../style/StudentTaskLog.css";
import headerImg from "../Images/hero1top 1.png";
import API_BASE_URL from "../config/api";


const StudentTaskLog = () => {
  const userId = localStorage.getItem("user_id");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadData = () => {
    fetch(`${API_BASE_URL}/api/student/task-log/?user_id=${userId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") setData(json);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadData();
  }, [userId]);

  const openModal = (task) => {
    if (task.submitted) return;
    setSelectedTask(task);
    setFile(null);
    setShowModal(true);
  };

  const submitTask = () => {
    if (!file) return alert("Select PDF file");

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("topic_id", selectedTask.id);
    formData.append("file", file);

    setUploading(true);

    fetch(`${API_BASE_URL}/api/student/task-log/`, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        setShowModal(false);
        loadData();
      })
      .finally(() => setUploading(false));
  };

  if (loading) return <p className="center">Loading...</p>;
  if (!data) return <p className="center">No data found</p>;

  const { student, tasks } = data;

  return (
    <div className="tasklog-wrapper">

      {/* ================= HEADER ================= */}
      <div className="tasklog-top">

        {/* LEFT CONTENT */}
        <div className="tasklog-top-left">
          <h2>
            Good Morning, <span>{student.name}</span>
          </h2>
          <p>Check Your Daily Task & schedules</p>

          <div className="top-meta">
            <span>Email : {student.email}</span>
            <span>Course : {student.course}</span>
            <span>Batch : {student.batch}</span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="tasklog-top-right">
          <img src={headerImg} alt="Student" />
        </div>

      </div>

      <h3 className="tasklog-title">Task Log</h3>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="tasklog-table desktop-only">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Topic</th>
              <th>Mentor</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Upload</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.topic}</td>
                <td>{t.mentor}</td>
                <td>{t.deadline}</td>
                <td>
                  <span className={`status ${t.status}`}>
                    {t.status === "completed"
                      ? "Submitted"
                      : t.status === "review"
                      ? "Pending"
                      : "Not Completed"}
                  </span>
                </td>
                <td>
                  <button
                    className="add-btn"
                    disabled={t.submitted}
                    onClick={() => openModal(t)}
                  >
                    {t.submitted ? "Uploaded" : "Add"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="tasklog-cards mobile-only">
        {tasks.map((t) => (
          <div className="task-card" key={t.id}>
            <div className="row"><span>Date</span><strong>{t.date}</strong></div>
            <div className="row"><span>Topic</span><strong>{t.topic}</strong></div>
            <div className="row"><span>Mentor</span><strong>{t.mentor}</strong></div>
            <div className="row"><span>Deadline</span><strong>{t.deadline}</strong></div>

            <div className="row">
              <span>Status</span>
              <span className={`status ${t.status}`}>
                {t.status === "completed"
                  ? "Submitted"
                  : t.status === "review"
                  ? "Pending"
                  : "Not Completed"}
              </span>
            </div>

            <button
              className="add-btn full"
              disabled={t.submitted}
              onClick={() => openModal(t)}
            >
              {t.submitted ? "Uploaded" : "Upload Task"}
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Upload Task PDF</h3>
            <p>{selectedTask.topic}</p>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button className="add-btn" onClick={submitTask}>
                {uploading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentTaskLog;
