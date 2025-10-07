import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardHeader from './component/UserDashboardHeader';
import UserDashboardCareersSTEM from './component/UserDashboardCareersSTEM';
import UserDashboardCareersABM from './component/UserDashboardCareersABM';
import UserDashboardCareersHUMSS from './component/UserDashboardCareersHUMSS';
import './UserDashboardCareers.css';

const UserDashboardCareers = () => {
  const navigate = useNavigate();
  const [strand, setStrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, navigate, API_BASE_URL]);

  const renderCareers = () => {
    if (!completed) {
      return (
        <div className="careers-locked">
          <div className="careers-locked-icon">🔒</div>
          <h2 className="careers-locked-title">Assessment Required</h2>
          <p className="careers-locked-text">
            You need to complete the Strandify Assessment first to unlock your personalized career recommendations.
          </p>
          <button
            className="careers-locked-btn"
            onClick={() => navigate('/userdashboardassessment')}
          >
            Take the Assessment
          </button>
        </div>
      );
    }

    if (!strand) {
      return (
        <div className="careers-locked">
          <p>No recommended strand found.</p>
        </div>
      );
    }

    switch (strand.toUpperCase()) {
      case "STEM":
        return <UserDashboardCareersSTEM />;
      case "ABM":
        return <UserDashboardCareersABM />;
      case "HUMSS":
        return <UserDashboardCareersHUMSS />;
      default:
        return (
          <div className="careers-locked">
            <p>Unknown strand: {strand}</p>
          </div>
        );
    }
  };

  return (
    <div className="careers-container">
      <UserDashboardHeader />
      <div className="careers-main-layout">
        <UserDashboardSidebar activeItem="Careers" />
        <div className="careers-main-content">
          {loading ? (
            <div className="careers-loading">
              <div className="loading-spinner"></div>
              <p>Loading careers...</p>
            </div>
          ) : (
            renderCareers()
          )}

          {/* Footer */}
          <div className="careers-footer">
            <p className="careers-copyright">
              © 2025 Strandify. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCareers;