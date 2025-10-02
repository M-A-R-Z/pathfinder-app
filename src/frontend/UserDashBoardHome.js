import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import './UserDashBoardHome.css';

const Header = () => (
  <div className="user-dashboard-header">
    <div className="user-dashboard-logo-section">
      <div className="user-dashboard-logo">
        <span className="user-dashboard-graduation-cap">🎓</span>
        <span className="user-dashboard-logo-text">PathFinder</span>
      </div>
    </div>
    <div className="user-dashboard-header-actions">
      <button className="user-dashboard-create-btn">+ Create</button>
      <div className="user-dashboard-profile-avatar">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          alt="Profile"
        />
      </div>
    </div>
  </div>
);

const UserDashBoardHome = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [activeDataSetId, setActiveDataSetId] = useState(null);
  const [userName, setUserName] = useState('');
  const [result, setResult] = useState(null);

  // Fetch user info + active dataset
  useEffect(() => {
    const fetchUserAndDataset = async () => {
      try {
        const meRes = await axios.get("http://localhost:5000/me", { withCredentials: true });
        const uid = meRes.data.user_id;
        setUserId(uid);
        setUserName(meRes.data.first_name || "User");

        const datasetRes = await axios.get("http://localhost:5000/active-dataset", { withCredentials: true });
        setActiveDataSetId(datasetRes.data.data_set_id || null);
      } catch (err) {
        console.error("Error fetching user or dataset:", err);
      }
    };
    fetchUserAndDataset();
  }, []);

  // Fetch progress + result
  useEffect(() => {
    const fetchProgressAndResult = async () => {
      if (!userId || !activeDataSetId) return;
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/progress/${userId}/${activeDataSetId}`,
          { withCredentials: true }
        );
        setProgress(res.data.progress || 0);
        setCompleted(res.data.completed || false);

        if (res.data.completed) {
          // Fetch submitted results
          const resultRes = await axios.get(
            `http://127.0.0.1:5000/results/${res.data.assessment_id}`,
            { withCredentials: true }
          );
          setResult(resultRes.data);
        }

      } catch (err) {
        console.error("Error fetching progress or result:", err);
      }
    };

    fetchProgressAndResult();
  }, [userId, activeDataSetId]);

  const handleTakeAssessment = () => {
    if (progress === 100 && !completed) {
      navigate('/userdashboardtakeassessment'); // submit pending
    } else if (progress === 100 && completed) {
      navigate('/userdashboardassessment'); // retake flow
    } else if (progress > 0) {
      navigate('/userdashboardtakeassessment'); // in-progress
    } else {
      navigate('/userdashboardassessment'); // new
    }
  };

  const goToStatistics = () => {
    if (result) navigate(`/userdashboard/statistics/${result.results_id}`);
  };

  const goToCareerMatch = () => {
    if (result) navigate(`/userdashboard/careermatch/${result.results_id}`);
  };

  return (
    <div className="user-dashboard-container">
      <Header />
      <div className="user-dashboard-main-layout">
        <UserDashboardSidebar activeItem="Dashboard" />
        <div className="user-dashboard-main-content">
          <div className="user-dashboard-welcome-section">
            <h1 className="user-dashboard-welcome-title">
              Welcome, <span className="user-dashboard-name-highlight">{userName}</span>!
            </h1>

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
                  Your recommended strand and career matches are ready.
                </p>
              </div>
            )}

            <div className="user-dashboard-get-started-section">
              <h2 className="user-dashboard-section-title">Get started with PathFinder!</h2>
              <p className="user-dashboard-section-description">
                Answer our assessment to find out which senior high school strand fits you
                best—and what careers you're most likely to succeed in.
              </p>
              <button
                className="user-dashboard-take-assessment-btn"
                onClick={handleTakeAssessment}
              >
                {progress === 100 && !completed
                  ? "Submit Assessment"
                  : progress === 100 && completed
                    ? "Retake the Assessment"
                    : progress > 0
                      ? "Resume Assessment"
                      : "Take the Assessment"}
              </button>
            </div>

            <div className="user-dashboard-grid">
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Recommended Strand</h3>
                <p className="strand-text">
                  {completed && result ? result.recommended_strand : "Locked until assessment is completed"}
                </p>
              </div>
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Top Career Match</h3>
                <p>{completed && result ? result.top_career || "Engineer (example)" : "Locked until assessment is completed"}</p>
                {completed && result && (
                  <button className="dashboard-action-btn" onClick={goToCareerMatch}>
                    View Career Match
                  </button>
                )}
              </div>
              <div className="user-dashboard-card">         
                <h3>Progress</h3>
                <p>
                  {progress.toFixed(0)}% {progress === 100 && !completed ? "(Pending submission)" : "complete"}
                </p>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>              
              </div>
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Statistics</h3>
                <p>{completed ? "View detailed breakdown" : "Locked until assessment is completed"}</p>
                {completed && result && (
                  <button className="dashboard-action-btn" onClick={goToStatistics}>
                    View Statistics
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="user-dashboard-footer">
            <p className="user-dashboard-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoardHome;
