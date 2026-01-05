import React, { useState, useEffect } from "react";
import "../style/Payment.css";
import qrImage from "../Images/qr-code.png";
import coursepic from "../Images/hero1top 1.png";
import API_BASE_URL from "../config/api";

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
  const userId = localStorage.getItem("user_id");
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!formData.userAmount || !formData.utr || !formData.screenshot) {
      alert("All fields are required");
      return;
    }

    if (Number(formData.userAmount) > Number(dueAmount)) {
      alert("Amount cannot exceed due amount");
      return;
    }

    const data = new FormData();
    data.append("user_id", userId);
    data.append("amount", formData.userAmount);
    data.append("utr", formData.utr);
    data.append("screenshot", formData.screenshot);

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/submit-payment/`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Payment submission failed");

      const json = await res.json();

      if (json.status === "success") {
        alert("Payment proof submitted");
        setFormData({ userAmount: "", utr: "", screenshot: null });
        refreshAmounts();
        setShowQR(false);
      } else {
        alert(json.message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
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

        <div className="bank-details">
          <strong>ABC Training Institute</strong>
          <p>UPI: abctraining@upi</p>
          <p>Account: 123456789012</p>
          <p>Bank: State Bank of India</p>
          <p>IFSC: SBIN0001234</p>
        </div>

        <div className="wallets">Paytm · GPay · PhonePe</div>

        <button className="scan-btn" onClick={() => setShowQR(true)}>
          Scan QR
        </button>

        <label>UTR / Transaction ID</label>
        <input name="utr" value={formData.utr} onChange={handleChange} />

        <label>Payment Screenshot</label>
        <input type="file" name="screenshot" onChange={handleChange} />

        <button className="submit-btn" onClick={submitPayment} disabled={loading}>
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
    if (!userId) return;

    fetch(`${API_BASE_URL}/api/student/profile/?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setUserData({
            fullName: data.profile.name,
            email: data.profile.email,
            course: data.profile.course,
          });
        }
      })
      .catch((err) => console.error(err));
  }, [userId]);

  const fetchAmounts = () => {
    if (!userId) return;

    fetch(`${API_BASE_URL}/api/payment-amount/?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Payment fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setAmountData({
            total_amount: data.total_amount,
            paid_amount: data.paid_amount,
            due_amount: data.due_amount,
          });

          setPaymentInfo({
            status: data.payment_status,
            remark: data.admin_remark,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAmounts();
  }, [userId]);

  return (
    <>
      <TopBar {...userData} />

      <div className="payment-wrapper">
        <h1 className="payment-title">Payment</h1>

        <div className="payment-container">
          <div className="left-side">
            <PaymentForm
              fullName={userData.fullName}
              dueAmount={amountData.due_amount}
              refreshAmounts={fetchAmounts}
              paymentInfo={paymentInfo}
            />
          </div>

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
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
