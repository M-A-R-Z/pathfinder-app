import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardCareersSTEM from './component/UserDashboardCareersSTEM';
import UserDashboardCareersABM from './component/UserDashboardCareersABM';
import UserDashboardCareersHUMSS from './component/UserDashboardCareersHUMSS';
import './UserDashboardCourses.css';

// Header Component
const Header = () => (
  <div className="courses-header">
    <div className="courses-logo-section">
      <div className="courses-logo">
        <span className="courses-graduation-cap">🎓</span>
        <span className="courses-logo-text">PathFinder</span>
      </div>
    </div>
    <div className="courses-header-actions">
      <button className="courses-create-btn">+ Create</button>
      <div className="courses-profile-avatar">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          alt="Profile"
        />
      </div>
    </div>
  </div>
);

const UserDashboardCourses = () => {
  const navigate = useNavigate();
  const [strand, setStrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // get logged-in user info + active dataset
        const meRes = await axios.get("http://localhost:5000/me", { withCredentials: true });
        const datasetRes = await axios.get("http://localhost:5000/active-dataset", { withCredentials: true });

        const res = await axios.get(
          `http://localhost:5000/progress/${meRes.data.user_id}/${datasetRes.data.data_set_id}`,
          { withCredentials: true }
        );

        setCompleted(res.data.completed || false);

        if (res.data.completed) {
          const resultRes = await axios.get(
            `http://127.0.0.1:5000/results/${res.data.assessment_id}`,
            { withCredentials: true }
          );
          setStrand(resultRes.data.recommended_strand);
        }
      } catch (err) {
        console.error("Error fetching results for courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const renderCourses = () => {
    if (!completed) {
      return (
        <div className="courses-locked">
          <p>You need to complete the PathFinder Assessment first.</p>
          <button
            className="dashboard-action-btn"
            onClick={() => navigate('/userdashboardassessment')}
          >
            Take the Assessment
          </button>
        </div>
      );
    }

    if (!strand) {
      return <p>No recommended strand found.</p>;
    }

    switch (strand.toUpperCase()) {
      case "STEM":
        return <UserDashboardCareersSTEM />;
      case "ABM":
        return <UserDashboardCareersABM />;
      case "HUMSS":
        return <UserDashboardCareersHUMSS />;
      default:
        return <p>Unknown strand: {strand}</p>;
    }
  };

  return (
    <div className="courses-container">
      <Header />
      <div className="courses-main-layout">
        <UserDashboardSidebar activeItem="Courses" />
        <div className="courses-main-content">
          {loading ? <p>Loading courses...</p> : renderCourses()}

          {/* Footer */}
          <div className="courses-footer">
            <p className="courses-copyright">
              © 2025 PathFinder. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardCourses;
