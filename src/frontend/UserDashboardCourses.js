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
          <div className="courses-locked-icon">🔒</div>
          <h2 className="courses-locked-title">Assessment Required</h2>
          <p className="courses-locked-text">
            You need to complete the PathFinder Assessment first to unlock your personalized course recommendations.
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
      <UserDashboardHeader />
      <div className="courses-main-layout">
        <UserDashboardSidebar activeItem="Courses" />
        <div className="courses-main-content">
          {loading ? (
            <div className="courses-loading">
              <div className="loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : (
            renderCourses()
          )}

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