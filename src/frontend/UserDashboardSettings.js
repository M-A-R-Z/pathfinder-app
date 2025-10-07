import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardHeader from './component/UserDashboardHeader';
import OTPModal from './component/OTPModal';
import ErrorModal from './component/ErrorModal';
import './UserDashboardSettings.css';

const UserDashboardSettings = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ new state for inline error
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setErrorMessage("Session expired. Please log in again.");
        navigate("/userlogin");
        return;
      }
      try {
        const meRes = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(meRes.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, [API_BASE_URL]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // clear inline error as user types
    setFieldErrors(prev => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    // reset inline errors
    setFieldErrors({ currentPassword: "" });

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMessage('Please fill in all password fields!');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/verify-password`,
        { password: passwordData.currentPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.valid) {
        // 👇 show inline error instead of modal
        setFieldErrors({ currentPassword: "Current password is incorrect!" });
        return;
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to verify password.");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setErrorMessage('New password must be different from current password!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long!');
      return;
    }

    setShowOTPModal(true);
  };

  return (
    <div className="settings-container">
      <UserDashboardHeader />
      <div className="settings-main-layout">
        <UserDashboardSidebar activeItem="Settings" />
        <div className="settings-main-content">
          <div className="settings-content-section">
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
            </div>

            <div className="settings-form">
              {/* Change Password Section */}
              <div className="settings-section">

                {/* Current Password with inline error */}
                <div className="settings-form-group">
                  <label className="settings-label">Current Password:</label>
                  {fieldErrors.currentPassword && (
                    <p className="error-text">{fieldErrors.currentPassword}</p>
                  )}
                  <div className="settings-password-wrapper">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`settings-input ${fieldErrors.currentPassword ? "input-error" : ""}`}
                      placeholder="**************"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="settings-password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      👁
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="settings-form-group">
                  <label className="settings-label">New Password:</label>
                  <div className="settings-password-wrapper">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="settings-input"
                      placeholder="**************"
                      minLength={8}
                      required                    
                    />
                    <button
                      type="button"
                      className="settings-password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      👁
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="settings-form-group">
                  <label className="settings-label">Confirm Password:</label>
                  <div className="settings-password-wrapper">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="settings-input"
                      placeholder="**************"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="settings-password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      👁
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="settings-save-section">
                <button 
                  className="settings-save-btn" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <p className="settings-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
      {/* ✅ Error Modal for global errors */}
      <ErrorModal
        isOpen={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
      {/* ✅ OTP Modal for Password Change */}
      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          mode="forgot"  
          formData={{
            email: userInfo?.email,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
          }}
          onSuccess={() => {
            setShowOTPModal(false);
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          }}
        />
      )}
    </div>
  );
};

export default UserDashboardSettings;
