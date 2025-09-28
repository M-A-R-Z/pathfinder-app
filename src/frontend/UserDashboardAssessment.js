import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import './UserDashboardAssessment.css';

// Header Component 
const Header = () => {
  return (
    <div className="assessment-header">
      <div className="assessment-logo-section">
        <div className="assessment-logo">
          <span className="assessment-graduation-cap">🎓</span>
          <span className="assessment-logo-text">PathFinder</span>
        </div>
      </div>
      <div className="assessment-header-actions">
        <button className="assessment-create-btn">
          + Create
        </button>
        <div className="assessment-profile-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
            alt="Profile" 
          />
        </div>
      </div>
    </div>
  );
};

// Main Assessment Component
const UserDashboardAssessment = () => {
  const navigate = useNavigate();

  const handleTakeAssessment = () => {
    navigate('/userdashboardtakeassessment');
  };

  return (
    <div className="assessment-container">
      <Header />
      <div className="assessment-main-layout">
        <UserDashboardSidebar activeItem="Assessment" />
        <div className="assessment-main-content">
          {/* Assessment Header */}
          <div className="assessment-content-section">
            <h1 className="assessment-title">PathFinder Assessment Test</h1>
            
            {/* Steps Grid */}
            <div className="assessment-steps-grid">
              {/* Step 1 */}
              <div className="assessment-step-card">
                <div className="step-header step-1">
                  <span className="step-number">STEP 1</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Complete the Test</h3>
                  <p className="step-description">
                    Be yourself and answer honestly to find out which strands fit you.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="assessment-step-card">
                <div className="step-header step-2">
                  <span className="step-number">STEP 2</span>
                </div>
                <div className="step-content">
                  <div className="step-icon">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                      alt="Statistics Icon"
                      className="step-icon-image"
                    />
                  </div>
                  <h3 className="step-title">View Statistics</h3>
                  <p className="step-description">
                    Learn how the strand given to you influenced your answers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="assessment-step-card">
                <div className="step-header step-3">
                  <span className="step-number">STEP 3</span>
                </div>
                <div className="step-content">
                  <div className="step-icon">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3002/3002543.png" 
                      alt="Course & Career Icon"
                      className="step-icon-image"
                    />
                  </div>
                  <h3 className="step-title">Check your Course & Career</h3>
                  <p className="step-description">
                    Find out what you can be and what you are capable of.
                  </p>
                </div>
              </div>
            </div>

            {/* Take Assessment Button */}
            <div className="assessment-action-section">
              <button className="assessment-take-btn" onClick={handleTakeAssessment}>
                Take the Assessment
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="assessment-footer">
            <p className="assessment-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardAssessment;