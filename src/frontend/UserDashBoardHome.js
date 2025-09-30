import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ for navigation
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import './UserDashBoardHome.css';

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
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userName, setUserName] = useState('Raphael'); // Replace with auth session later
  const navigate = useNavigate(); // ✅ navigation hook

  // Mock values (replace with session/auth context)
  const userId = 1;
  const activeDataSetId = 1; // TODO: fetch from backend (the active dataset)

  // Fetch assessment progress
  useEffect(() => {
    axios
      .get(`/progress/${userId}/${activeDataSetId}`, { withCredentials: true })
      .then((res) => {
        setProgress(res.data.progress || 0);
        setCompleted(res.data.completed || false);
      })
      .catch((err) => console.error('Error fetching progress:', err));
  }, [userId, activeDataSetId]);

  // Handle navigation to assessment page
  const handleTakeAssessment = () => {
    navigate('/userdashboardassessment'); // ✅ navigate to assessment page
  };

  return (
    <div className="user-dashboard-container">
      <Header />
      <div className="user-dashboard-main-layout">
        <UserDashboardSidebar activeItem="Dashboard" />
        <div className="user-dashboard-main-content">
          {/* Welcome Section */}
          <div className="user-dashboard-welcome-section">
            <h1 className="user-dashboard-welcome-title">
              Welcome, <span className="user-dashboard-name-highlight">{userName}</span>!
            </h1>
            
            {/* Assessment Banner */}
            {!completed ? (
              <div className="user-dashboard-assessment-banner">
                <p className="user-dashboard-banner-title">You haven't completed the PathFinder Assessment yet.</p>
                <p className="user-dashboard-banner-subtitle">
                  Take the quiz to discover your recommended career path and strand.
                </p>
              </div>
            ) : (
              <div className="user-dashboard-assessment-banner completed">
                <p className="user-dashboard-banner-title">🎉 Congratulations! You finished the PathFinder Assessment.</p>
                <p className="user-dashboard-banner-subtitle">
                  Check your recommended strand, career match, and statistics below.
                </p>
              </div>
            )}

            {/* Get Started Section */}
            <div className="user-dashboard-get-started-section">
              <h2 className="user-dashboard-section-title">Get started with PathFinder!</h2>
              <p className="user-dashboard-section-description">
                Answer our assessment to find out which senior high school strand fits you 
                best—and what careers you're most likely to succeed in.
              </p>
              <button
                className="user-dashboard-take-assessment-btn"
                onClick={handleTakeAssessment} // ✅ go to assessment page
              >
                {completed ? "Retake the Assessment" : "Take the Assessment"}
              </button>
            </div>

            {/* Dashboard Cards */}
            <div className="user-dashboard-grid">
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Recommended Strand</h3>
                <p>{completed ? "STEM (example)" : "Locked until assessment is completed"}</p>
              </div>
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Top Career Match</h3>
                <p>{completed ? "Engineer (example)" : "Locked until assessment is completed"}</p>
              </div>
              <div className="user-dashboard-card">
                <h3>Progress</h3>
                <p>{progress}% complete</p>
              </div>
            </div>

            {/* Statistics Card */}
            <div className={`user-dashboard-statistics-card ${!completed ? 'locked' : ''}`}>
              <h3>Check your statistics</h3>
              <p>{completed ? "View detailed breakdown" : "Locked until assessment is completed"}</p>
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
