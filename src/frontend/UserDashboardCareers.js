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
  useEffect(() => {
    const fetchResult = async () => {
      try {
        // get logged-in user info + active dataset
        const meRes = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`, { withCredentials: true });

        const res = await axios.get(
          `${API_BASE_URL}/progress/${meRes.data.user_id}/${datasetRes.data.data_set_id}`,
          { withCredentials: true }
        );

        setCompleted(res.data.completed || false);

        if (res.data.completed) {
          const resultRes = await axios.get(
            `${API_BASE_URL}/results/${res.data.assessment_id}`,
            { withCredentials: true }
          );
          setStrand(resultRes.data.recommended_strand);
        }
      } catch (err) {
        console.error("Error fetching results for careers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const renderCareers = () => {
    if (!completed) {
      return (
        <div className="careers-locked">
          <div className="careers-locked-icon">🔒</div>
          <h2 className="careers-locked-title">Assessment Required</h2>
          <p className="careers-locked-text">
            You need to complete the PathFinder Assessment first to unlock your personalized career recommendations.
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
              © 2025 PathFinder. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCareers;