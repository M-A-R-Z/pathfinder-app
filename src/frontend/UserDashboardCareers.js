import React from 'react';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardCareersSTEM from './component/UserDashboardCareersSTEM';
import UserDashboardCareersABM from './component/UserDashboardCareersABM';
import UserDashboardCareersHUMSS from './component/UserDashboardCareersHUMSS';
import './UserDashboardCareers.css';

// Header Component
const Header = () => {
  return (
    <div className="careers-header">
      <div className="careers-logo-section">
        <div className="careers-logo">
          <span className="careers-graduation-cap">🎓</span>
          <span className="careers-logo-text">PathFinder</span>
        </div>
      </div>
      <div className="careers-header-actions">
        <button className="careers-create-btn">
          + Create
        </button>
        <div className="careers-profile-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
            alt="Profile" 
          />
        </div>
      </div>
    </div>
  );
};

// Main Careers Page Component
const UserDashboardCareers = () => {
  return (
    <div className="careers-container">
      <Header />
      <div className="careers-main-layout">
        <UserDashboardSidebar activeItem="Careers" />
        <div className="careers-main-content">
          <UserDashboardCareersHUMSS />

          {/* Footer */}
          <div className="careers-footer">
            <p className="careers-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCareers;