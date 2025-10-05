import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardHeader from './component/UserDashboardHeader';
import OTPModal from './component/OTPModal';
import './UserDashboardSettings.css';

const UserDashboardSettings = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
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

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // fetch logged in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
        setUserInfo(res.data);
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
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
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
                <div className="settings-form-group">
                  <label className="settings-label">Current Password:</label>
                  <div className="settings-password-wrapper">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="settings-input"
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

      {/* ✅ OTP Modal for Password Change */}
      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          mode="forgot"   // or "change", depending on your backend logic
          formData={{
            email: userInfo?.email,
            currentPassword: passwordData.currentPassword,
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
