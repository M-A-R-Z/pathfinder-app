import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/OTPModal.css";

const OTPModal = ({ isOpen, onClose, formData = {}, mode = "signup", onSuccess }) => {
  const { email = "", newPassword = "", confirmPassword = "" } = formData;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resetToken, setResetToken] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const otpSent = useRef(false); // ✅ ensure initial OTP only sent once

  useEffect(() => {
    if (!isOpen || mode !== "forgot" || otpSent.current) return;

    const sendInitialOtp = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/request-otp`, { email });
        setResetToken(res.data.reset_token);
        setCooldown(60);
        otpSent.current = true; // mark as sent
      } catch (err) {
        console.error("Failed to send OTP:", err.response?.data || err.message);
      }
    };

    sendInitialOtp();
  }, [isOpen, mode, email, API_BASE_URL]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    if (mode === "forgot") {
      if (!newPassword || !confirmPassword) {
        alert("Password fields required.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);
    try {
      let res;
      if (mode === "signup") {
        res = await axios.post(`${API_BASE_URL}/verify-email`, { otp: otpString });
        if (res.data.success) {
          onSuccess?.();
          navigate("/");
        }
      } else if (mode === "forgot") {
        res = await axios.post(`${API_BASE_URL}/forgot-password`, {
          otp: otpString,
          reset_token: resetToken,
          newPassword
        });
        if (res.data.success) {
          onSuccess?.();
          alert("Password reset successfully!");
          navigate("/");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    try {
      if (mode === "forgot") {
        const res = await axios.post(`${API_BASE_URL}/request-otp`, { email });
        setResetToken(res.data.reset_token);
        setCooldown(60);
        alert("New OTP sent!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(prev => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <button className="otp-close" onClick={onClose}>×</button>
        <h2 className="title">{mode === "signup" ? "Verify Your Email" : "Reset Your Password"}</h2>
        <p className="description">
          Enter the 6-digit code sent to your email {mode === "signup" ? "to complete signup." : "to reset your password."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                className="otp-digit"
                value={digit}
                onChange={e => handleInputChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                maxLength={1}
              />
            ))}
          </div>
          <button type="submit" disabled={isLoading}>{isLoading ? "Verifying..." : "Verify"}</button>
        </form>

        <button onClick={handleResend} disabled={cooldown > 0}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
