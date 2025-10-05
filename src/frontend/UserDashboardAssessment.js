import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserDashboardSidebar from "./component/UserDashboardSidebar";
import UserDashboardHeader from "./component/UserDashboardHeader";
import "./UserDashboardAssessment.css";

const UserDashboardAssessment = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [datasetId, setDatasetId] = useState(null);
  const [existingAssessment, setExistingAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  // Fetch user info and existing assessment
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await axios.get(`${API_BASE_URL}/me`, {
          withCredentials: true,
        });
        setUserId(meRes.data.user_id);

        const datasetRes = await axios.get(
          `${API_BASE_URL}/active-dataset`,
          { withCredentials: true }
        );
        setDatasetId(datasetRes.data.data_set_id);

        const progressRes = await axios.get(
          `${API_BASE_URL}/progress/${meRes.data.user_id}/${datasetRes.data.data_set_id}`,
          { withCredentials: true }
        );

        if (progressRes.data && !progressRes.data.error) {
          setExistingAssessment(progressRes.data);
        }
      } catch (err) {
        console.error("Error fetching assessment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigate to take/resume assessment
  const handleTakeAssessment = () => navigate("/userdashboardtakeassessment");
  const handleResumeAssessment = () => navigate("/userdashboardtakeassessment");

  // Handle retake with confirmation modal
  const handleRetakeAssessment = async () => {
    if (!existingAssessment) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/assessment/${existingAssessment.assessment_id}`,
        { withCredentials: true }
      );

      setExistingAssessment(null);
      navigate("/userdashboardtakeassessment");
    } catch (err) {
      console.error("Error retaking assessment:", err);
    } finally {
      setShowRetakeConfirm(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="assessment-container">
      <UserDashboardHeader />
      <div className="assessment-main-layout">
        <UserDashboardSidebar activeItem="Assessment" />
        <div className="assessment-main-content">
          <div className="assessment-content-section">
            <h1 className="assessment-title">Strandify Assessment Test</h1>

            {/* Steps Grid */}
            <div className="assessment-steps-grid">
              {[
                {
                  step: 1,
                  title: "Complete the Test",
                  description:
                    "Be yourself and answer honestly to find out which strands fit you.",
                  icon: null,
                },
                {
                  step: 2,
                  title: "View Statistics",
                  description:
                    "Learn how the strand given to you influenced your answers.",
                  icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                },
                {
                  step: 3,
                  title: "Check your Course & Career",
                  description: "Find out what you can be and what you are capable of.",
                  icon: "https://cdn-icons-png.flaticon.com/512/3002/3002543.png",
                },
              ].map(({ step, title, description, icon }) => (
                <div key={step} className="assessment-step-card">
                  <div className={`step-header step-${step}`}>
                    <span className="step-number">STEP {step}</span>
                  </div>
                  <div className="step-content">
                    {icon && (
                      <div className="step-icon">
                        <img src={icon} alt="" className="step-icon-image" />
                      </div>
                    )}
                    <h3 className="step-title">{title}</h3>
                    <p className="step-description">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="assessment-action-section">
              {!existingAssessment && (
                <button className="assessment-option-btn" onClick={handleTakeAssessment}>
                  Take the Assessment
                </button>
              )}

              {existingAssessment && !existingAssessment.completed && (
                <>
                  <button
                    className="assessment-option-btn"
                    onClick={handleResumeAssessment}
                  >
                    Resume Assessment
                  </button>
                  <button
                    className="assessment-option-btn"
                    onClick={() => setShowRetakeConfirm(true)}
                  >
                    Retake Assessment
                  </button>
                </>
              )}

              {existingAssessment && existingAssessment.completed && (
                <button
                  className="assessment-option-btn"
                  onClick={() => setShowRetakeConfirm(true)}
                >
                  Retake Assessment
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="assessment-footer">
            <p className="assessment-copyright">
              © 2025 Strandify. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Retake Confirmation Modal */}
      {showRetakeConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to retake the assessment? This will erase your previous results.</p>
            <div className="modal-actions">
              <button onClick={() => setShowRetakeConfirm(false)}>Cancel</button>
              <button onClick={handleRetakeAssessment}>Yes, Retake</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardAssessment;