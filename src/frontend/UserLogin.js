import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import LoginIcon from "../assets/Login 1.png";
import logo from "../assets/logo.png";

const UserLogin = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        
        console.log("Login successful:", data);
        localStorage.setItem("authToken", data.token);

        // Redirect to dashboard
        navigate("/userdashboardhome");
      } else {
        alert(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    navigate("/userforgotpassword");
  };

  const handleSignUp = () => {
    navigate("/usersignup");
  };

  const handleClose = () => {
    if (onClose) onClose();
    navigate("/");
  };

  const EyeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.49 18.49 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.52 18.52 0 0 1-2.16 3.19M1 1l22 22" />
    </svg>
  );

  return (
    <div className="login-page">
      <div className="login-main">
        {/* Left side - Quote and Illustration */}
        <div className="login-left">
          <div className="login-quote">
            <h1 className="login-quote-text">
              "
              <span className="login-highlight">Smart Choices</span> Begin with
              the <span className="login-highlight">Right Direction</span>"
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="login-header-section">
              <div className="login-avatar-container">
                <img
                  src={LoginIcon}
                  alt="User Avatar"
                  className="login-avatar-img"
                />
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">
                Sign in to continue your journey
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
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
                className={`login-btn ${isLoading ? "login-loading" : ""}`}
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
