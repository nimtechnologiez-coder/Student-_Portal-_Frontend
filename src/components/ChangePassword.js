import React, { useState } from "react";
import "../style/ChangePassword.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ SUCCESS MODAL STATE
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChangePassword = async () => {
  setError("");

  if (!username || !oldPassword || !newPassword || !confirmPassword) {
    setError("All fields are required!");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("New password and confirm password do not match!");
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/student/change-password/`,
      {
        username,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }
    );

    const data = response.data;
    setLoading(false);

    if (data.status === "success") {
      setShowSuccess(true);
    } else {
      setError(data.message);
    }
  } catch (err) {
    setLoading(false);
    setError("Server error! Try again later.");
  }
};

  return (
    <>
      {/* ---------------- SUCCESS MODAL ---------------- */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">🎉 Password Updated</h2>
            <p className="modal-text">
              Your password has been changed successfully.
            </p>

            <button className="modal-btn" onClick={() => navigate("/")}>
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* ------------------- MAIN UI ------------------- */}
      <div className="forgot-wrapper">
        <div className="forgot-card">

          <h1 className="forgot-heading">NIM Academy</h1>
          <h2 className="forgot-welcome">Reset Password</h2>

          {error && <div className="forgot-error">{error}</div>}

          <label className="input-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="forgot-input"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="input-label">Old Password</label>
          <input
            type="password"
            placeholder="Enter your old password"
            className="forgot-input"
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label className="input-label">New Password</label>
          <input
            type="password"
            placeholder="Enter your new password"
            className="forgot-input"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="input-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your new password"
            className="forgot-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="forgot-btn"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <p className="back" onClick={() => navigate("/")}>
            ← Back to Login
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
