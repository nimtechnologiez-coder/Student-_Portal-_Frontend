import { useEffect, useState } from "react";
import "../style/settings.css";
import coursepic from "../Images/hero1top 1.png";

const Settings = () => {
  const userId = localStorage.getItem("user_id");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [theme, setTheme] = useState("light"); // ✅ editable

  // ==========================
  // FETCH PROFILE (VIEW ONLY)
  // ==========================
  useEffect(() => {
    if (!userId) return;

    fetch(`http://127.0.0.1:8000/api/student_settings_api/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.profile) {
          setFullName(data.profile.name || "");
          setEmail(data.profile.email || "");
          setCourse(data.profile.course || "");
          setBatch(data.profile.batch || "");
          setMobile(String(data.profile.mobile || ""));
          setProfilePhoto(data.profile.profile_photo || "");
        }
      });
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="settings-container settings-page">
      {/* HEADER */}
      <div className="settings-section">
        <div className="settings-content">
          <div className="settings-text">
            <h1>
              Good Morning, <span>{fullName}</span>
            </h1>
            <p>Check Your Daily Task & schedules</p>
          </div>

          <div className="settings-info">
            <div className="infos-grid">
              <div className="infos-item">
                <span className="infos-label">Email</span>
                <span className="infos-value">{email}</span>
              </div>
              <div className="infos-item">
                <span className="infos-label">Course</span>
                <span className="infos-value">{course}</span>
              </div>
              <div className="infos-item">
                <span className="infos-label">Batch</span>
                <span className="infos-value">{batch}</span>
              </div>
            </div>

            <div className="settings-image">
              <img src={coursepic} alt="Students" />
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE */}
      <div className="profile-settings-box">
        <div className="profile-top">
          <img
            src={profilePhoto || "https://via.placeholder.com/100"}
            className="profile-photo"
            alt="profile"
          />
          <div className="profile-info">
            <h3 className="profile-name">{fullName}</h3>
            <p className="profile-email">{email}</p>
          </div>
        </div>

        <div className="profile-right">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={fullName} readOnly />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input type="text" value={course} readOnly />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} readOnly />
          </div>

          {/* ✅ ONLY THEME IS EDITABLE */}
          <div className="form-group">
            <label>Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* ❌ MOBILE – VIEW ONLY */}
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" value={mobile} readOnly />
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">↩</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
