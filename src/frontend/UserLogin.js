import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './UserLogin.css';
import LoginIcon from '../assets/Login 1.png';
import logo from '../assets/logo.png';
import axios from 'axios';
axios.defaults.withCredentials = true;

const UserLogin = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFormData(prev => ({
          ...prev,
          rememberMe: true,
          email: decoded.email || ""
        }));
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        localStorage.removeItem("token");
      }
    }
  }, []);
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
    const { email, password, rememberMe } = formData;
    console.log('Login attempted with:', formData);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (res.data.success) {
        const token = res.data.token;
        if (rememberMe)
          localStorage.setItem("token", token);
        else
          sessionStorage.setItem("token", token);
        navigate("/userdashboardhome");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Try again.");
      }
    }
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    navigate('/userforgotpassword');
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

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-.722-3.25"/>
      <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
      <path d="m20 15-1.726-2.05"/>
      <path d="m4 15 1.726-2.05"/>
      <path d="m9 18 .722-3.25"/>
    </svg>
  );

  return (
    <div className="login-page">
      <div className="login-main">
        {/* Left side - Quote and Illustration */}
        <div className="login-left">
          <div className="login-quote">
            <h1 className="login-quote-text">
              "<span className="login-highlight">Smart Choices</span> Begin with the <span className="login-highlight">Right Direction</span>"
            </h1>
          </div>
          
          <div className="login-illustration">
            <div className="login-3d-scene">
              <div className="login-3d-globe">
                <div className="login-globe">🌍</div>
                <div className="login-grad-cap">🎓</div>
              </div>
              
              <div className="login-orbit-container">
                <div className="login-3d-books">
                  <div className="login-book login-book-1">📚</div>
                  <div className="login-book login-book-2">📖</div>
                  <div className="login-book login-book-3">📕</div>
                </div>
                
                <div className="login-3d-bulb">💡</div>
                <div className="login-3d-pencil">✏️</div>
                
                <div className="login-floating-element login-element-1">📐</div>
                <div className="login-floating-element login-element-2">🔬</div>
                <div className="login-floating-element login-element-3">🧮</div>
                <div className="login-floating-element login-element-4">📊</div>
              </div>
              
              <div className="login-orbit-container-small">
                <div className="login-shape login-shape-circle"></div>
                <div className="login-shape login-shape-cube"></div>
                <div className="login-shape login-shape-ring"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="login-right">
          <div className="login-form-panel">
            <button className="login-close" onClick={handleClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="login-header-section">
              <div className="login-avatar-container">
                <img src={LoginIcon} alt="User Avatar" className="login-avatar-img" />
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to continue your journey</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <svg className="login-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <svg className="login-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="login-input"
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
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
                    className="login-checkbox"
                  />
                  <span className="login-checkbox-label">Remember me</span>
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
                {isLoading ? (
                  <>
                    <span className="login-spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>

              <div className="login-divider">
                <span>or</span>
              </div>

              <div className="login-signup">
                <p>Don't have an account?</p>
                <button
                  type="button"
                  className="login-signup-btn"
                  onClick={handleSignUp}
                >
                  Create Account
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
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