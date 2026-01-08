import React, { useState, useEffect } from "react";
import "../style/Payment.css";
import qrImage from "../Images/qr-code.png";
import coursepic from "../Images/hero1top 1.png";

/* ================= TOP BAR ================= */
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

/* ================= PAYMENT FORM ================= */
const PaymentForm = ({ fullName, dueAmount, refreshAmounts, paymentInfo }) => {
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const userId = localStorage.getItem("user_id");

  const [formData, setFormData] = useState({
    userAmount: "",
    utr: "",
    screenshot: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const submitPayment = async () => {
    if (!formData.userAmount || !formData.utr || !formData.screenshot) return;
    if (Number(formData.userAmount) > Number(dueAmount)) return;

    const data = new FormData();
    data.append("user_id", userId);
    data.append("amount", formData.userAmount);
    data.append("utr", formData.utr);
    data.append("screenshot", formData.screenshot);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/submit-payment/", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (res.ok && json.status === "success") {
        setShowSuccess(true);
        setFormData({ userAmount: "", utr: "", screenshot: null });
        refreshAmounts();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="payment-form">
        <h1 className="title">Payment</h1>

        <label>Full Name</label>
        <input value={fullName} disabled />

        <label>Amount</label>
        <input
          type="number"
          name="userAmount"
          max={dueAmount}
          placeholder={`Max ₹${dueAmount}`}
          value={formData.userAmount}
          onChange={handleChange}
        />

        <label>UTR / Transaction ID</label>
        <input
          name="utr"
          value={formData.utr}
          onChange={handleChange}
        />

        <label>Payment Screenshot</label>
        <input type="file" name="screenshot" onChange={handleChange} />

        <button
          className="submit-btn"
          onClick={submitPayment}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Payment Proof"}
        </button>

        <div className="status-box">
          Status:{" "}
          <b>
            {paymentInfo.status === "approved" && "Approved ✅"}
            {paymentInfo.status === "pending" && "Waiting for Admin Approval ⏳"}
            {paymentInfo.status === "rejected" && "Rejected ❌"}
          </b>

          {paymentInfo.status === "rejected" && paymentInfo.remark && (
            <div style={{ marginTop: "6px", color: "#f44336" }}>
              Reason: {paymentInfo.remark}
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="payment-success-overlay">
          <div className="payment-success-modal">
            <h2>Payment Proof Submitted ✅</h2>
            <p>Please wait for admin verification.</p>
            <button onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      )}

      {/* QR POPUP */}
      {showQR && (
        <div className="qr-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-box" onClick={(e) => e.stopPropagation()}>
            <h2>Scan QR</h2>
            <img src={qrImage} alt="QR" />
            <button onClick={() => setShowQR(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= MAIN PAGE ================= */
const PaymentPage = () => {
  const userId = localStorage.getItem("user_id");

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    course: "",
  });

  const [amountData, setAmountData] = useState({
    total_amount: 0,
    paid_amount: 0,
    due_amount: 0,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    status: "",
    remark: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/student/profile/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUserData({
            fullName: data.profile.name,
            email: data.profile.email,
            course: data.profile.course,
          });
        }
      });
  }, [userId]);

  const fetchAmounts = () => {
    fetch(`http://localhost:8000/api/payment-amount/?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAmountData(data);
          setPaymentInfo({
            status: data.payment_status,
            remark: data.admin_remark,
          });
        }
      });
  };

  useEffect(() => {
    fetchAmounts();
  }, [userId]);

  return (
    <>
      <TopBar {...userData} />

      <div className="payment-wrapper">
        <div className="payment-container">
          {/* LEFT */}
          <div className="left-side">
            <PaymentForm
              fullName={userData.fullName}
              dueAmount={amountData.due_amount}
              refreshAmounts={fetchAmounts}
              paymentInfo={paymentInfo}
            />
          </div>

          {/* RIGHT */}
          <div className="right-side">
            <div className="amount-box">
              <h3>Total Amount</h3>
              <p className="rupee">₹{amountData.total_amount}</p>
            </div>

            <div className="amount-box">
              <h3>Paid Amount</h3>
              <p className="rupee">₹{amountData.paid_amount}</p>
            </div>

            <div className="amount-box">
              <h3>Due Amount</h3>
              <p className="rupee">₹{amountData.due_amount}</p>
            </div>

            {/* BANK DETAILS RIGHT SIDE */}
        <div className="bank-box">
  <h3>Bank Details</h3>

  <p>
    <b>Institute:</b> Nim TECHNOLOGIES
  </p>

  <p>
    <b>Account:</b> 272702000000336
  </p>

  <p>
    <b>Bank:</b> Indian Overseas Bank
  </p>

  <p>
    <b>IFSC:</b> IOBA0002727
  </p>

  {/* WALLET ICONS */}
  <div className="wallet-icons">
    <span className="wallet-item gpay">
      <i className="bi bi-google"></i> GPay
    </span>

    <span className="wallet-item phonepe">
      <i className="bi bi-phone"></i> PhonePe
    </span>

    <span className="wallet-item paytm">
      <i className="bi bi-wallet2"></i> Paytm
    </span>
  </div>
</div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
