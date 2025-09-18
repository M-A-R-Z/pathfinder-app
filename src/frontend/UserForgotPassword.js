import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserForgotPassword.css';
import ForgotIcon from '../assets/Forgot Password.png';

const UserForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Password reset requested for:', email);
      setShowResetForm(true);
      setIsLoading(false);
    }, 1500);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Password reset completed for:', email);
      alert('Password has been reset successfully!');
      navigate('/userlogin');
      setIsLoading(false);
    }, 1500);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  const handleBackToLogin = () => {
    navigate('/userlogin');
  };

  return (
    <div className="forgot-page">
      {/* Logo */}
      <div className="forgot-header">
        <div className="forgot-logo">
          <span className="forgot-logo-icon">🎓</span>
          <span className="forgot-logo-text">PathFinder</span>
        </div>
      </div>

      <div className="forgot-main">
        <div className="forgot-left">
          <div className="forgot-quote">
            <h1 className="forgot-quote-text">
              "A moment of <span className="forgot-highlight">confusion</span>, a step toward <span className="forgot-highlight">clarity</span>."
            </h1>
          </div>
          
          {/* 3D Educational Illustration with Orbiting Objects */}
          <div className="forgot-illustration">
            <div className="forgot-3d-scene">
              {/* Central Globe with Graduation Cap */}
              <div className="forgot-3d-globe">
                <div className="forgot-globe">🌍</div>
                <div className="forgot-grad-cap">🎓</div>
              </div>
              
              {/* Main orbital container for larger objects */}
              <div className="forgot-orbit-container">
                {/* Books Stack */}
                <div className="forgot-3d-books">
                  <div className="forgot-book forgot-book-1">📚</div>
                  <div className="forgot-book forgot-book-2">📖</div>
                  <div className="forgot-book forgot-book-3">📕</div>
                </div>
                
                {/* Light Bulb */}
                <div className="forgot-3d-bulb">💡</div>
                
                {/* Pencil */}
                <div className="forgot-3d-pencil">✏️</div>
                
                {/* Floating Elements */}
                <div className="forgot-floating-element forgot-element-1">📐</div>
                <div className="forgot-floating-element forgot-element-2">🔬</div>
                <div className="forgot-floating-element forgot-element-3">🧮</div>
                <div className="forgot-floating-element forgot-element-4">📊</div>
              </div>
              
              {/* Smaller orbital container for geometric shapes */}
              <div className="forgot-orbit-container-small">
                <div className="forgot-shape forgot-shape-circle"></div>
                <div className="forgot-shape forgot-shape-cube"></div>
                <div className="forgot-shape forgot-shape-ring"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="forgot-right">
          <div className="forgot-form-panel">
            {/* Close button */}
            <button className="forgot-close" onClick={handleClose}>
              ×
            </button>

            <div className="forgot-user-section">
              <div className="forgot-user-avatar">
                  <img 
                    src={ForgotIcon}
                    alt="User Avatar" 
                    className="forgot-avatar-raw"
                  />
              </div>
            </div>

            {!showResetForm ? (
              <form className="forgot-form" onSubmit={handleSubmit}>
                <div className="forgot-title">
                  <h2>Forgot Password?</h2>
                  <p>Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <div className="forgot-field">
                  <label className="forgot-label">
                    Enter Username / Email <span className="forgot-asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username / Email"
                    className="forgot-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`forgot-btn ${isLoading ? 'forgot-loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="forgot-spinner"></span> : 'SUBMIT'}
                </button>

                <div className="forgot-back">
                  Remember your password?{' '}
                  <button
                    type="button"
                    className="forgot-back-btn"
                    onClick={handleBackToLogin}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form className="forgot-form" onSubmit={handlePasswordReset}>
                <div className="forgot-title">
                  <h2>Reset Password</h2>
                  <p>Enter your new password below.</p>
                </div>

                <div className="forgot-field">
                  <label className="forgot-label">
                    Enter New Password <span className="forgot-asterisk">*</span>
                  </label>
                  <div className="forgot-password-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Password"
                      className="forgot-input"
                      required
                    />
                    <button
                      type="button"
                      className="forgot-eye-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="forgot-field">
                  <label className="forgot-label">
                    Confirm New Password <span className="forgot-asterisk">*</span>
                  </label>
                  <div className="forgot-password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Confirm Password"
                      className="forgot-input"
                      required
                    />
                    <button
                      type="button"
                      className="forgot-eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`forgot-btn ${isLoading ? 'forgot-loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="forgot-spinner"></span> : 'SUBMIT'}
                </button>

                <div className="forgot-back">
                  <button
                    type="button"
                    className="forgot-back-btn"
                    onClick={handleBackToLogin}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForgotPassword;