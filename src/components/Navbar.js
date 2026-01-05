import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Calendar,
  BarChart3,
  CreditCard,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";

import "../style/Navbar.css";
import API_BASE_URL from "../config/api";

// ✅ DEFAULT AVATAR (SAFE FALLBACK)
const DEFAULT_AVATAR = "https://i.imgur.com/QCNbOAo.png";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem("user_id");

  const [profile, setProfile] = useState({
    name: "Student",
    profile_photo: null,
  });

  // ==================================================
  // FETCH STUDENT PROFILE
  // ==================================================
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE_URL}/api/student/profile/?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setProfile({
            name: data.profile.name || "Student",
            profile_photo: data.profile.profile_photo || null,
          });
        }
      })
      .catch((err) => {
        console.error("Profile API error:", err);
        setProfile({
          name: "Student",
          profile_photo: null,
        });
      });
  }, [userId]);

  // ==================================================
  // BODY SCROLL FIX FOR MOBILE
  // ==================================================
  useEffect(() => {
    if (open) {
      document.body.classList.add("sidebar-opened");
    } else {
      document.body.classList.remove("sidebar-opened");
    }

    return () => document.body.classList.remove("sidebar-opened");
  }, [open]);

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <button className="hamburger-btn" onClick={() => setOpen(true)}>
        <Menu size={26} />
      </button>

      {/* OVERLAY */}
      {open && <div className="sidebar-overlay" onClick={handleClose} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          <X size={26} />
        </button>

        <h2 className="sidebar-title">Student Dashboard</h2>

        {/* ================= USER PROFILE ================= */}
        <div className="user-profile">
          <img
            src={profile.profile_photo || DEFAULT_AVATAR}
            alt="Student"
            className="profile-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
          />
          <div>
            <span className="welcome-text">Welcome</span>
            <br />
            <span className="user-name">{profile.name}</span>
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="nav-menu">
          <Link
            to="/student-dashboard"
            onClick={handleClose}
            className={`nav-item ${
              pathname === "/student-dashboard" ? "active" : ""
            }`}
          >
            <Home size={20} /> Dashboard
          </Link>

          <Link
            to="/course"
            onClick={handleClose}
            className={`nav-item ${pathname === "/course" ? "active" : ""}`}
          >
            <ShoppingCart size={20} /> My Courses
          </Link>

          <Link
            to="/attendancedashboard"
            onClick={handleClose}
            className={`nav-item ${
              pathname === "/attendancedashboard" ? "active" : ""
            }`}
          >
            <Calendar size={20} /> Attendance
          </Link>

          <Link
            to="/student/task-log"
            onClick={handleClose}
            className={`nav-item ${
              pathname === "/student/task-log" ? "active" : ""
            }`}
          >
            <BarChart3 size={20} /> Tasks
          </Link>

          <Link
            to="/payment"
            onClick={handleClose}
            className={`nav-item ${pathname === "/payment" ? "active" : ""}`}
          >
            <CreditCard size={20} /> Payments
          </Link>
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="sidebar-footer">
          <Link to="/chat" onClick={handleClose} className="footer-item">
            <MessageSquare size={20} /> Chat
          </Link>

          <Link to="/settings" onClick={handleClose} className="footer-item">
            <Settings size={20} /> Settings
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
