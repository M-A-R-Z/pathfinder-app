import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardHeader from './component/UserDashboardHeader';
import UserDashboardCoursesSTEM from './component/UserDashboardCoursesSTEM';
import UserDashboardCoursesABM from './component/UserDashboardCoursesABM';
import UserDashboardCoursesHUMSS from './component/UserDashboardCoursesHUMSS';
import './UserDashboardCourses.css';

const UserDashboardCourses = () => {
  const navigate = useNavigate();
  const [strand, setStrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        showAlertMessage("Session expired. Please log in again.", "error");
        setTimeout(() => navigate("/userlogin"), 1500);
        return;
      }

      try {
        const meRes = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const datasetId = datasetRes.data.data_set_id || null;

        if (!datasetId) {
          console.error("No active dataset found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}/progress/${meRes.data.user_id}/${datasetRes.data.data_set_id}`,
          { headers: { Authorization: `Bearer ${token}`  }}
        );

        setCompleted(res.data.completed || false);

        if (res.data.completed) {
          const resultRes = await axios.get(
            `${API_BASE_URL}/results/${res.data.assessment_id}`,
            { headers: { Authorization: `Bearer ${token}`  }}
          );
          setStrand(resultRes.data.recommended_strand);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        if (err.response?.status === 401) {
          showAlertMessage("Session expired. Please log in again.", "error");
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setTimeout(() => navigate("/userlogin"), 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, navigate, API_BASE_URL]);

  if (loading) {
    return (
      <div className="courses-container">
        <UserDashboardHeader />
        <div className="courses-main-layout">
          <UserDashboardSidebar activeItem="Courses" />
          <div className="courses-main-content">
            <div className="courses-loading">
              <div className="loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCourses = () => {
    if (!completed) {
      return (
        <div className="courses-locked">
          <div className="courses-locked-icon">🔒</div>
          <h2 className="courses-locked-title">Assessment Required</h2>
          <p className="courses-locked-text">
            You need to complete the Strandify Assessment first to unlock your personalized course recommendations.
          </p>
          <button
            className="courses-locked-btn"
            onClick={() => navigate('/userdashboardassessment')}
          >
            Take the Assessment
          </button>
        </div>
      );
    }

    if (!strand) {
      return (
        <div className="courses-locked">
          <p>No recommended strand found.</p>
        </div>
      );
    }

    switch (strand.toUpperCase()) {
      case "STEM":
        return <UserDashboardCoursesSTEM />;
      case "ABM":
        return <UserDashboardCoursesABM />;
      case "HUMSS":
        return <UserDashboardCoursesHUMSS />;
      default:
        return (
          <div className="courses-locked">
            <p>Unknown strand: {strand}</p>
          </div>
        );
    }
  };

  return (
    <div className="courses-container">
      {/* Custom Alert */}
      {showAlert && (
        <div className="custom-alert">
          <div className={`alert-content ${alertType === 'error' ? 'error' : ''}`}>
            <span className="alert-icon">{alertType === 'error' ? '✕' : '✓'}</span>
            <span className="alert-text">{alertMessage}</span>
          </div>
        </div>
      )}

      <UserDashboardHeader />
      <div className="courses-main-layout">
        <UserDashboardSidebar activeItem="Courses" />
        <div className="courses-main-content">
          {renderCourses()}

          {/* Footer */}
          <div className="courses-footer">
            <p className="courses-copyright">
              © 2025 Strandify. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCourses;