import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSignUp.css';
import axios from 'axios';
import OTPModal from "./component/OTPModal";

const UserSignUp = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    middleName: '',
    surname: '',
    affix: '',
    birthday: '',
    password: '',
    confirmPassword: ''

  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const navigate = useNavigate();

  // Eye icon components (since you might not have Lucide React)
  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-.722-3.25"/>
      <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
      <path d="m20 15-1.726-2.05"/>
      <path d="m4 15 1.726-2.05"/>
      <path d="m9 18 .722-3.25"/>
    </svg>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting signup:", formData);
      const res = await axios.post(
        `${API_BASE_URL}/signup`,
        { 
          email: formData.email, 
          password: formData.password,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.surname,
          affix: formData.affix,
          birthday: formData.birthday,
          confirmPassword: formData.confirmPassword

        },
      );

      if (res.data.success) {
        // ✅ merge signup token into formData
        setFormData(prev => ({
          ...prev,
          signupToken: res.data.signup_token
        }));

        setIsOtpOpen(true);   // open OTP modal
      } else {
        alert(res.data.message || "Signup failed.");
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    navigate('/userlogin');
  };

  return (
    <div className="signup-page">
      {/* Header */}
      <div className="signup-header">
        <div className="signup-logo">
        </div>
      </div>

      {/* Quote Section */}
      <div className="signup-quote-section">
        <h1 className="signup-main-quote">
          "Begin with <span className="signup-highlight">Purpose</span>."
        </h1>
      </div>

      {/* Main Form Container */}
      <div className="signup-form-container">
        {/* Close Button */}
        <button className="signup-close" onClick={handleClose}>
          ×
        </button>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form-content">
            {/* Left Form - Personal Information */}
            <div className="signup-form-left">
              <h2 className="signup-section-title">Sign - Up</h2>
              
              <div className="signup-field">
                <label className="signup-label">
                  First Name <span className="signup-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="signup-input"
                  required
                />
              </div>

              <div className="signup-field">
                <label className="signup-label">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Middle Name"
                  className="signup-input"
                />
              </div>

              <div className="signup-field-row">
                <div className="signup-field signup-field-large">
                  <label className="signup-label">
                    Surname <span className="signup-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    placeholder="Surname"
                    className="signup-input"
                    required
                  />
                </div>

                <div className="signup-field signup-field-small">
                  <label className="signup-label">Affix</label>
                  <input
                    type="text"
                    name="affix"
                    value={formData.affix}
                    onChange={handleInputChange}
                    placeholder="Affix"
                    className="signup-input"
                  />
                </div>
              </div>

              <div className="signup-field-row">
                <div className="signup-field signup-field-half">
                  <label className="signup-label">
                    Birthday <span className="signup-asterisk">*</span>
                  </label>
                  <div className="signup-date-wrapper">
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="signup-input signup-date-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form - Account Information */}
            <div className="signup-form-right">
              <div className="signup-field">
                <label className="signup-label">
                  Student Email <span className="signup-asterisk">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Student Email"
                  className="signup-input"
                  required
                />
              </div>

              <div className="signup-field">
                <label className="signup-label">
                  Password <span className="signup-asterisk">*</span>
                </label>
                <div className="signup-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="signup-input"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="signup-field">
                <label className="signup-label">
                  Confirm Password <span className="signup-asterisk">*</span>
                </label>
                <div className="signup-password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="signup-input"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`signup-btn ${isLoading ? 'signup-loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span className="signup-spinner"></span> : 'SIGN - UP'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* OTP Modal */}
      <OTPModal 
        isOpen={isOtpOpen} 
        onClose={() => setIsOtpOpen(false)}
        formData={formData}  
        mode="signup"
        onSuccess={() => {
          alert("Signup complete, email verified!");
          navigate('/userlogin');
        }}
      />
    </div>
  );
};

export default UserSignUp;