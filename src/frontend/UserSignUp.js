import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSignUp.css';
import SignupIcon1 from '../assets/Sign up 1.png';
import SignupIcon2 from '../assets/Sign up 2.png';
import axios from 'axios';
import OTPModal from "./component/OTPModal";


const UserSignUp = ({ onClose }) => {
  const [formData, setFormData] = useState({
    studentEmail: '',
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
  const navigate = useNavigate();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const handleSignup = async (formData) => {
    const res = await axios.post("http://localhost:5000/signup", formData, {
      withCredentials: true,
    });
    if (res.data.success) {
      setIsOtpOpen(true);
    }
  };


  const handleVerify = async (otp) => {
  try {
    const res = await axios.post("http://localhost:5000/verify-email", { otp },
        { withCredentials: true });
    if (res.data.success) {
      if (res.data.success) {
        alert("Email verified, account created!");
        setIsOtpOpen(false);
        navigate("/");
      } else {
        alert(res.data.message || "Invalid code");
      }
    }
  } catch (error) {
    if (error.res) {
      // Backend gave a response with error status (like 400)
      alert(error.response.data.message); 
    } else {
      // Network or unexpected error
      alert("Something went wrong, try again later.");
    }
  }
};

  const handleResend = async () => {
    await axios.post(
      "http://localhost:5000/verify-email",
      { resend: true },
      { withCredentials: true }
    );
    alert("New OTP sent!");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await axios.post(
        "http://localhost:5000/signup",
        { 
          email: formData.studentEmail, 
          password: formData.password,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.surname,
          affix: formData.affix,
          birthday: formData.birthday,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        },
        { withCredentials: true }  // important for cookies/sessions
      );

      if (res.data.success) {
          
          setIsOtpOpen(true);
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    navigate('/userlogin');
  };

  return (
    <div className="signup-page">
      {/* Decorative Images */}
      {/*<img 
        src={SignupIcon2}
        alt="Books decoration" 
        className="signup-decoration-left"
      />
      <img 
        src={SignupIcon1} 
        alt="Trophy decoration" 
        className="signup-decoration-right"
      />*/}

      {/* Header */}
      <div className="signup-header">
        <div className="signup-logo">
          <span className="signup-logo-icon">🎓</span>
          <span className="signup-logo-text">PathFinder</span>
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
                <label className="signup-label">
                  Middle Name 
                </label>
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
                  name="studentEmail"
                  value={formData.studentEmail}
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
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁️
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
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    👁️
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
          <OTPModal
            isOpen={isOtpOpen}
            onClose={() => setIsOtpOpen(false)}
            onSubmit={handleVerify}
            onResend={handleResend}
          />
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;