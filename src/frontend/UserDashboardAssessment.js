import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import './UserDashboardAssessment.css';

// Header Component 
const Header = () => (
  <div className="assessment-header">
    <div className="assessment-logo-section">
      <div className="assessment-logo">
        <span className="assessment-graduation-cap">🎓</span>
        <span className="assessment-logo-text">PathFinder</span>
      </div>
    </div>
    <div className="assessment-header-actions">
      <button className="assessment-create-btn">+ Create</button>
      <div className="assessment-profile-avatar">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
          alt="Profile" 
        />
      </div>
    </div>
  </div>
);

const UserDashboardAssessment = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [datasetId, setDatasetId] = useState(null);
  const [existingAssessment, setExistingAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user and check for existing assessment
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await axios.get('http://localhost:5000/me', { withCredentials: true });
        setUserId(meRes.data.user_id);

        // Get active dataset
        const datasetRes = await axios.get('http://localhost:5000/active-dataset', { withCredentials: true });
        setDatasetId(datasetRes.data.data_set_id);

        // Check for existing assessment by user_id + dataset_id
        const res = await axios.get(
          `http://localhost:5000/progress/${meRes.data.user_id}/${datasetRes.data.data_set_id}`,
          { withCredentials: true }
        );

        if (res.data && !res.data.error) {
          setExistingAssessment(res.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTakeAssessment = () => {
    navigate('/userdashboardtakeassessment');
  };

  const handleResumeAssessment = () => {
    navigate('/userdashboardtakeassessment'); // backend will fetch by user_id + dataset_id
  };

  const handleRetakeAssessment = async () => {
    if (!existingAssessment) return;

    try {
      await axios.delete(
        `http://localhost:5000/assessment/${existingAssessment.assessment_id}`,
        { withCredentials: true }
      );
      setExistingAssessment(null);
      navigate('/userdashboardtakeassessment'); // start new
    } catch (err) {
      console.error('Error retaking assessment:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="assessment-container">
      <Header />
      <div className="assessment-main-layout">
        <UserDashboardSidebar activeItem="Assessment" />
        <div className="assessment-main-content">
          <div className="assessment-content-section">
            <h1 className="assessment-title">PathFinder Assessment Test</h1>
            
            {/* Steps Grid */}
            <div className="assessment-steps-grid">
              <div className="assessment-step-card">
                <div className="step-header step-1"><span className="step-number">STEP 1</span></div>
                <div className="step-content">
                  <h3 className="step-title">Complete the Test</h3>
                  <p className="step-description">
                    Be yourself and answer honestly to find out which strands fit you.
                  </p>
                </div>
              </div>
              <div className="assessment-step-card">
                <div className="step-header step-2"><span className="step-number">STEP 2</span></div>
                <div className="step-content">
                  <div className="step-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Statistics Icon" className="step-icon-image"/>
                  </div>
                  <h3 className="step-title">View Statistics</h3>
                  <p className="step-description">Learn how the strand given to you influenced your answers.</p>
                </div>
              </div>
              <div className="assessment-step-card">
                <div className="step-header step-3"><span className="step-number">STEP 3</span></div>
                <div className="step-content">
                  <div className="step-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/3002/3002543.png" alt="Course & Career Icon" className="step-icon-image"/>
                  </div>
                  <h3 className="step-title">Check your Course & Career</h3>
                  <p className="step-description">Find out what you can be and what you are capable of.</p>
                </div>
              </div>
            </div>

            {/* Take / Resume / Retake Buttons */}
            <div className="assessment-action-section">
              {!existingAssessment && (
                <button className="assessment-option-btn" onClick={handleTakeAssessment}>
                  Take the Assessment
                </button>
              )}

              {existingAssessment && !existingAssessment.completed && (
                <>
                  <button className="assessment-option-btn" onClick={handleResumeAssessment}>
                    Resume Assessment
                  </button>
                  <button className="assessment-option-btn" onClick={handleRetakeAssessment}>
                    Retake Assessment
                  </button>
                </>
              )}

              {existingAssessment && existingAssessment.completed && (
                <button className="assessment-option-btn" onClick={handleRetakeAssessment}>
                  Retake Assessment
                </button>
              )}
            </div>
          </div>

          <div className="assessment-footer">
            <p className="assessment-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardAssessment;
