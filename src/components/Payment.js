import React, { useState, useEffect } from "react";
import "../style/Payment.css";
import qrImage from "../Images/qr-code.png";
import coursepic from "../Images/hero1top 1.png";
import API_BASE_URL from "../config/api";

 
/* ---------------- TOP BAR ---------------- */
const TopBar = ({ fullName, email, course }) => {
  return (
    <div className="settingsa-container">
      <div className="settingsa-section">
        <div className="settingsa-content">
          <div className="settingsa-text">
            <h1>
              Good Morning, <span>{fullName}</span>
            </h1>
            <p>Check Your Daily Task & schedules</p>
          </div>
 
          <div className="settingsa-info">
            <div className="infosa-grid">
              <div className="infosa-item">
                <span className="infosa-label">Email</span>
                <span className="infossa-value">{email}</span>
              </div>
 
              <div className="infosa-item">
                <span className="infosa-label">Course</span>
                <span className="infosa-value">{course}</span>
              </div>
 
              <div className="infosa-item">
                <span className="infosa-label">Batch</span>
                <span className="infosa-value">Batch A1 (Morning)</span>
              </div>
            </div>
 
            <div className="settingsa-image">
              <img src={coursepic} alt="Students" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
/* ---------------- QR POPUP ---------------- */
const QrPopup = ({ show, onClose, qrImage }) => {
  if (!show) return null;
 
  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-box" onClick={(e) => e.stopPropagation()}>
        <h1 className="qr-title">Payment</h1>
        <img src={qrImage} alt="QR Code" className="qr-image" />
        <p className="qr-text">Scan the Code 🔍</p>
        <button className="qr-back-btn" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  );
};
 
/* ---------------- PAYMENT FORM ---------------- */
const PaymentForm = () => {
  const [showQR, setShowQR] = useState(false);
 
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    address: "",
    userAmount: "",
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handlePay = (e) => {
    e.preventDefault();
 
    if (!formData.userAmount || formData.userAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
 
    setShowQR(true);
  };
 
  return (
    <>
      <form className="payment-form" onSubmit={handlePay}>
        <h1 className="title">Payment</h1>
 
        <label>Full Name</label>
        <input name="fullName" value={formData.fullName} onChange={handleChange} required />
 
        <label>Street Address</label>
        <input name="street" value={formData.street} onChange={handleChange} required />
 
        <label>City</label>
        <input name="city" value={formData.city} onChange={handleChange} required />
 
        <label>State</label>
        <input name="state" value={formData.state} onChange={handleChange} required />
 
        <label>Country</label>
        <input name="country" value={formData.country} onChange={handleChange} required />
 
        <label>Pin Code</label>
        <input name="pinCode" value={formData.pinCode} onChange={handleChange} required />
 
        <label>Amount</label>
        <input
          type="number"
          name="userAmount"
          value={formData.userAmount}
          onChange={handleChange}
          placeholder="Enter Amount"
          required
        />
 
        <label>Address</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required />
 
        <div className="wallets">
          <span>Paytm</span>
          <span>GPay</span>
          <span>PhonePe</span>
        </div>
 
        <button className="pay-btn" type="submit">
          Pay
        </button>
      </form>
 
      <QrPopup show={showQR} onClose={() => setShowQR(false)} qrImage={qrImage} />
    </>
  );
};
 
/* ---------------- MAIN PAGE ---------------- */
const PaymentPage = () => {
  const [amountData, setAmountData] = useState({
    due_amount: 0,
    total_amount: 0,
  });
 
  // Mock user data (later connect API)
  const userId = localStorage.getItem("user_id");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    course: "",
  });
  useEffect(() => {
    if (!userId) return;        
    fetch(`${API_BASE_URL}/api/student/profile/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUserData({
            fullName: data.profile.name,
            email: data.profile.email,
            course: data.profile.course_name,
          });
        }       
      })  
      .catch(() => console.error("Profile fetch error"));
  }, [userId]);

 
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/student/payment-amount/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) =>
        setAmountData({
          due_amount: data.due_amount || 0,
          total_amount: data.total_amount || 0,
        })
      )
      .catch(() => console.log("Amount fetch error"));
  }, []);
 
  return (
    <>
      <TopBar
        fullName={userData.fullName}
        email={userData.email}
        course={userData.course}
      />
 
      <div className="payment-wrapper">
        <h1 className="payment-title">Payment</h1>
 
        <div className="payment-container">
          <div className="left-side">
            <PaymentForm />
          </div>
 
          <div className="right-side">
            <div className="amount-box">
              <h3>Due Amount</h3>
              <p className="rupee">₹{amountData.due_amount}</p>
            </div>
 
            <div className="amount-box">
              <h3>Total Amount</h3>
              <p className="rupee">₹{amountData.total_amount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default PaymentPage;
 
 