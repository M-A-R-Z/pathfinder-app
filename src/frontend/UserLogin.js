import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';
import LoginIcon from '../assets/Login 1.png';

const UserLogin = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Login attempted with:', formData);
      alert('Login functionality would be implemented here!');
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here!');
  };

  const handleSignUp = () => {
    navigate('/usersignup');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  return (
    <div className="login-page">
      {/* Logo */}
      <div className="login-header">
        <div className="login-logo">
          <span className="login-logo-icon">🎓</span>
          <span className="login-logo-text">PathFinder</span>
        </div>
      </div>

      <div className="login-main">
        <div className="login-left">
          <div className="login-quote">
            <h1 className="login-quote-text">
              "<span className="login-highlight">Smart Choices</span> Begin with the <span className="login-highlight">Right Direction</span>"
            </h1>
          </div>
          
          {/* 3D Educational Illustration with Orbiting Objects */}
          <div className="login-illustration">
            <div className="login-3d-scene">
              {/* Central Globe with Graduation Cap */}
              <div className="login-3d-globe">
                <div className="login-globe">🌍</div>
                <div className="login-grad-cap">🎓</div>
              </div>
              
              {/* Main orbital container for larger objects */}
              <div className="login-orbit-container">
                {/* Books Stack */}
                <div className="login-3d-books">
                  <div className="login-book login-book-1">📚</div>
                  <div className="login-book login-book-2">📖</div>
                  <div className="login-book login-book-3">📕</div>
                </div>
                
                {/* Light Bulb */}
                <div className="login-3d-bulb">💡</div>
                
                {/* Pencil */}
                <div className="login-3d-pencil">✏️</div>
                
                {/* Floating Elements */}
                <div className="login-floating-element login-element-1">📐</div>
                <div className="login-floating-element login-element-2">🔬</div>
                <div className="login-floating-element login-element-3">🧮</div>
                <div className="login-floating-element login-element-4">📊</div>
              </div>
              
              {/* Smaller orbital container for geometric shapes */}
              <div className="login-orbit-container-small">
                <div className="login-shape login-shape-circle"></div>
                <div className="login-shape login-shape-cube"></div>
                <div className="login-shape login-shape-ring"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-panel">
            {/* Close button */}
            <button className="login-close" onClick={handleClose}>
              ×
            </button>

            <div className="login-user-section">
              <div className="login-user-avatar">
                  <img 
                    src={LoginIcon}
                    alt="User Avatar" 
                    className="login-avatar-raw"
                  />
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">
                  Username / Email <span className="login-asterisk">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Username / Email"
                  className="login-input"
                  required
                />
              </div>

              <div className="login-field">
                <label className="login-label">
                  Password <span className="login-asterisk">*</span>
                </label>
                <div className="login-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="login-input"
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  Remember Me
                </label>
                
                <button
                  type="button"
                  className="login-forgot"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className={`login-btn ${isLoading ? 'login-loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span className="login-spinner"></span> : 'LOG - IN'}
              </button>

              <div className="login-signup">
                Don't have an Account?{' '}
                <button
                  type="button"
                  className="login-signup-btn"
                  onClick={handleSignUp}
                >
                  Sign in now.
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;