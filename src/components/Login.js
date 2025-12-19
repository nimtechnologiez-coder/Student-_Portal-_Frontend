import React, { useState, useEffect } from "react";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import login from "../Images/login.png";
import API_BASE_URL from "../config/api";   // ✅ ONLY THIS

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/student/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();
      setLoading(false);

      if (result.status === "success") {
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("student_name", result.name);
        localStorage.setItem("student_email", result.email);
        localStorage.setItem("valid_upto", result.valid_upto);

        setShowModal(true);
      } else if (result.status === "expired") {
        setErrors(result.message);
      } else {
        setErrors(result.message || "Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      setErrors("Server error. Try again later.");
    }
  };

  return (
    <div className="page-bg">
      <div className="main-card">
        {/* LEFT */}
        <div className="left-section">
          <h2>Login</h2>
          <p className="subtext">Enter your account details</p>

          {errors && <div className="login-error">{errors}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email / Username</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <h1>
            Welcome to <br />
            <span>student portal</span>
          </h1>
          <img src={login} alt="illustration" />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Login Successful 🎉</h3>
            <button onClick={() => navigate("/student-dashboard")}>
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
