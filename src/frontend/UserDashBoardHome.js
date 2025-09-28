import React from 'react';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import './UserDashboardHome.css';

// Header Component
const Header = () => {
  return (
    <div className="user-dashboard-header">
      <div className="user-dashboard-logo-section">
        <div className="user-dashboard-logo">
          <span className="user-dashboard-graduation-cap">🎓</span>
          <span className="user-dashboard-logo-text">PathFinder</span>
        </div>
      </div>
      <div className="user-dashboard-header-actions">
        <button className="user-dashboard-create-btn">
          + Create
        </button>
        <div className="user-dashboard-profile-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
            alt="Profile" 
          />
        </div>
      </div>
    </div>
  );
};

// Main UserDashBoardHome Component
const UserDashBoardHome = () => {
  return (
    <div className="user-dashboard-container">
      <Header />
      <div className="user-dashboard-main-layout">
        <UserDashboardSidebar activeItem="Dashboard" />
        <div className="user-dashboard-main-content">
          {/* Welcome Section */}
          <div className="user-dashboard-welcome-section">
            <h1 className="user-dashboard-welcome-title">
              Welcome, <span className="user-dashboard-name-highlight">Raphael</span>!
            </h1>
            
            {/* Assessment Banner */}
            <div className="user-dashboard-assessment-banner">
              <p className="user-dashboard-banner-title">You haven't taken the PathFinder Assessment yet.</p>
              <p className="user-dashboard-banner-subtitle">
                Take the quiz to discover your recommended career path and strand.
              </p>
            </div>

            {/* Get Started Section */}
            <div className="user-dashboard-get-started-section">
              <h2 className="user-dashboard-section-title">Get started with PathFinder!</h2>
              <p className="user-dashboard-section-description">
                Answer our assessment to find out which senior high school strand fits you 
                best—and what careers you're most likely to succeed in.
              </p>
              <button className="user-dashboard-take-assessment-btn">
                Take the Assessment
              </button>
            </div>

            {/* Dashboard Cards */}
            <div className="user-dashboard-grid">
              <div className="user-dashboard-card locked">
                <h3>Recommended Strand</h3>
                <p>Locked until assessment is completed</p>
              </div>
              <div className="user-dashboard-card locked">
                <h3>Top Career Match</h3>
                <p>Locked until assessment is completed</p>
              </div>
              <div className="user-dashboard-card">
                <h3>Progress</h3>
                <p>0% complete</p>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="user-dashboard-statistics-card locked">
              <h3>Check your statistics</h3>
              <p>Locked until assessment is completed</p>
            </div>
          </div>

          {/* Footer */}
          <div className="user-dashboard-footer">
            <p className="user-dashboard-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoardHome;