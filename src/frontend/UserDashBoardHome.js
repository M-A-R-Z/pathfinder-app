import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardHeader from './component/UserDashboardHeader';
import './UserDashBoardHome.css';

const UserDashBoardHome = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [result, setResult] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/userlogin");
        return;
      }

      try {
        // 1️⃣ Fetch user info
        const meRes = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

       
        setUserName(meRes.data.first_name || "User");

        // 2️⃣ Fetch active dataset
        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const datasetId = datasetRes.data.data_set_id || null;

        if (!datasetId) {
          console.error("No active dataset found");
          setLoading(false);
          return;
        }

        // 3️⃣ Fetch progress
        const progressRes = await axios.get(
          `${API_BASE_URL}/progress/${meRes.data.user_id}/${datasetId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProgress(progressRes.data.progress || 0);
        setCompleted(progressRes.data.completed || false);

        // 4️⃣ Fetch results if completed
        if (progressRes.data.completed) {
          const resultRes = await axios.get(
            `${API_BASE_URL}/results/${progressRes.data.assessment_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setResult(resultRes.data);
        }

      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, navigate, API_BASE_URL]);

  if (loading) {
    return (
      <div className="user-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  const handleTakeAssessment = () => {
    if (progress === 100 && !completed) {
      navigate('/userdashboardtakeassessment'); // submit pending
    } else if (progress === 100 && completed) {
      navigate('/userdashboardassessment'); // retake flow
    } else if (progress > 0 && progress < 100) {
      navigate('/userdashboardtakeassessment'); // in-progress
    } else {
      navigate('/userdashboardassessment'); // new
    }
  };

  const goToStatistics = () => {
    if (result) navigate(`/userdashboardstatistics`);
  };
  const goToCareerMatch = () => {
    if (result) navigate(`/userdashboardcareers`);
  };
  const goToCourseMatch = () => {
    if (result) navigate(`/userdashboardcourses`);
  };

  return (
    <div className="user-dashboard-container">
      <UserDashboardHeader />
      <div className="user-dashboard-main-layout">
        <UserDashboardSidebar activeItem="Dashboard" />
        <div className="user-dashboard-main-content">
          <div className="user-dashboard-welcome-section">
            <h1 className="user-dashboard-welcome-title">
              Welcome, <span className="user-dashboard-name-highlight">{userName}</span>!
            </h1>

            {!completed ? (
              <div className="user-dashboard-assessment-banner">
                <p className="user-dashboard-banner-title">You haven't completed the Strandify Assessment yet.</p>
                <p className="user-dashboard-banner-subtitle">
                  Take the quiz to discover your recommended career path and strand.
                </p>
              </div>
            ) : (
              <div className="user-dashboard-assessment-banner completed">
                <p className="user-dashboard-banner-title">🎉 Congratulations! You finished the Strandify Assessment.</p>
                <p className="user-dashboard-banner-subtitle">
                  Your recommended strand and career matches are ready.
                </p>
              </div>
            )}

            <div className="user-dashboard-get-started-section">
              <h2 className="user-dashboard-section-title">Get started with Strandify!</h2>
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
                <p
                  className={`strand-text ${completed ? 'strand-completed' : ''} ${
                    result?.recommended_strand === 'STEM'
                      ? 'strand-stem'
                      : result?.recommended_strand === 'HUMSS'
                      ? 'strand-humss'
                      : result?.recommended_strand === 'ABM'
                      ? 'strand-abm'
                      : ''
                  }`}
                >
                  {completed && result
                    ? result.recommended_strand
                    : "Locked until assessment is completed"}
                </p>
              </div>
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Alligned Courses</h3>
                <p>{completed && result ? result.top_career : "Locked until assessment is completed"}</p>
                {completed && result && (
                  <button className="dashboard-action-btn" onClick={goToCourseMatch}>
                    View Course Match
                  </button>
                )}
              </div>
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Alligned Careers</h3>
                <p>{completed && result ? result.top_career : "Locked until assessment is completed"}</p>
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
            <p className="user-dashboard-copyright">© 2025 Strandify. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoardHome;