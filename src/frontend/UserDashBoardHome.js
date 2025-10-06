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
  const [userId, setUserId] = useState(null);
  const [activeDataSetId, setActiveDataSetId] = useState(null);
  const [userName, setUserName] = useState('');
  const [result, setResult] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    const checkAuth = async () => {
      // Get token (check both localStorage and sessionStorage for "remember me")
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("token");
      console.log("Checking auth with token:", token);
      if (!token) {

        navigate("/userlogin");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uid = res.data.user_id;
        setUserId(uid);
        setUserName(res.data.first_name || "User");
      } catch (err) {
        console.error("Auth check failed:", err);
        // Token invalid or expired → redirect to login
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("userlogin");
      }
    };

    checkAuth();
  }, [navigate, API_BASE_URL]);

  // ---------------- FETCH ACTIVE DATASET ----------------
  useEffect(() => {
    const fetchDataset = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActiveDataSetId(datasetRes.data.data_set_id || null);
      } catch (err) {
        console.error("Error fetching dataset:", err);
      }
    };

    fetchDataset();
  }, [API_BASE_URL]);

  // ---------------- FETCH PROGRESS + RESULTS ----------------
  useEffect(() => {
    const fetchProgressAndResult = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!userId || !activeDataSetId || !token) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/progress/${userId}/${activeDataSetId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgress(res.data.progress || 0);
        setCompleted(res.data.completed || false);

        if (res.data.completed) {
          const resultRes = await axios.get(
            `${API_BASE_URL}/results/${res.data.assessment_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setResult(resultRes.data);
        }
      } catch (err) {
        console.error("Error fetching progress or result:", err);
      }
    };

    fetchProgressAndResult();
  }, [userId, activeDataSetId, API_BASE_URL]);

  // ---------------- NAVIGATION HANDLERS ----------------
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

  const goToStatistics = () => result && navigate(`/userdashboardstatistics`);
  const goToCareerMatch = () => result && navigate(`/userdashboardcareers`);
  const goToCourseMatch = () => result && navigate(`/userdashboardcourses`);

  // ---------------- UI ----------------
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
                <h3>Aligned Courses</h3>
                <p>{completed && result ? result.top_course : "Locked until assessment is completed"}</p>
                {completed && result && (
                  <button className="dashboard-action-btn" onClick={goToCourseMatch}>
                    View Course Match
                  </button>
                )}
              </div>
              <div className={`user-dashboard-card ${!completed ? 'locked' : ''}`}>
                <h3>Aligned Careers</h3>
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
