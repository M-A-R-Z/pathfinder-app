import React from 'react';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardCoursesSTEM from './component/UserDashboardCoursesSTEM';
import './UserDashboardCourses.css';

// Header Component
const Header = () => {
  return (
    <div className="courses-header">
      <div className="courses-logo-section">
        <div className="courses-logo">
          <span className="courses-graduation-cap">🎓</span>
          <span className="courses-logo-text">PathFinder</span>
        </div>
      </div>
      <div className="courses-header-actions">
        <button className="courses-create-btn">
          + Create
        </button>
        <div className="courses-profile-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
            alt="Profile" 
          />
        </div>
      </div>
    </div>
  );
};

// Main Courses Page Component
const UserDashboardCourses = () => {
  return (
    <div className="courses-container">
      <Header />
      <div className="courses-main-layout">
        <UserDashboardSidebar activeItem="Courses" />
        <div className="courses-main-content">
          <UserDashboardCoursesSTEM />

          {/* Footer */}
          <div className="courses-footer">
            <p className="courses-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCourses;