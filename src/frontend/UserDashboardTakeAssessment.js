import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserDashboardSidebar from "./component/UserDashboardSidebar";
import "./UserDashboardTakeAssessment.css";

const Header = () => (
  <div className="take-assessment-header">
    <div className="take-assessment-logo-section">
      <div className="take-assessment-logo">
        <span className="take-assessment-graduation-cap">🎓</span>
        <span className="take-assessment-logo-text">PathFinder</span>
      </div>
    </div>
    <div className="take-assessment-header-actions">
      <button className="take-assessment-create-btn">+ Create</button>
      <div className="take-assessment-profile-avatar">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          alt="Profile"
        />
      </div>
    </div>
  </div>
);

const UserDashboardTakeAssessment = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(0);
  const [isFirstYear, setIsFirstYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [answers, setAnswers] = useState({});
  const [datasetId, setDatasetId] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);
  const [existingAssessment, setExistingAssessment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // new states for submit process
  const [submitting, setSubmitting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const questionRefs = useRef({});
  const [validationError, setValidationError] = useState(null);
  const questionsPerPage = 15;
  const currentPage = step;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  // ---------------- Fetch initial data ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
        setUserId(meRes.data.user_id);

        const coursesRes = await axios.get(`${API_BASE_URL}/courses`);
        setCourses(coursesRes.data);

        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`);
        const active = datasetRes.data;

        if (!active.question_set_id) return console.error("Active dataset has no question set");
        setDatasetId(active.data_set_id);

        const questionsRes = await axios.get(
          `${API_BASE_URL}/question-sets/${active.question_set_id}`
        );
        const data = questionsRes.data;
        setQuestions(data.questions || []);
        setTotalPages(Math.ceil((data.questions || []).length / questionsPerPage));

        const res = await axios.get(
          `${API_BASE_URL}/progress/${meRes.data.user_id}/${active.data_set_id}`,
          { withCredentials: true }
        );

        if (res.data && !res.data.error) {
          const existing = res.data;
          setExistingAssessment(existing);
          setAssessmentId(existing.assessment_id);
          setProgress(existing.progress || 0);
          setIsFirstYear(existing.is_first_year);
          setSelectedCourse(existing.course_id || "");

          const answersRes = await axios.get(
            `${API_BASE_URL}/assessment/${existing.assessment_id}/answers`,
            { withCredentials: true }
          );
          const savedAnswers = {};
          answersRes.data.forEach((ans) => {
            savedAnswers[ans.question_id] = ans.answer_value;
          });
          setAnswers(savedAnswers);

          setStep(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- Warn before leaving ----------------
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (progress > 0 && progress < 100) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? Your progress will be saved.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [progress]);

  // ---------------- Start assessment ----------------
  const handleStartAssessment = () => {
    if (assessmentId) {
      setStep(1);
      return;
    }

    if (!userId || !datasetId) return;
    const payload = {
      user_id: userId,
      data_set_id: datasetId,
      is_first_year: isFirstYear,
      course_id: selectedCourse || null,
    };

    axios
      .post(`${API_BASE_URL}/assessments`, payload, { withCredentials: true })
      .then((res) => {
        setAssessmentId(res.data.assessment_id);
        setStep(1);
      })
      .catch((err) => console.error("Error starting assessment:", err));
  };

  // ---------------- Handle answer change ----------------
  const handleAnswerChange = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (!assessmentId) return;

    axios
      .put(
        `${API_BASE_URL}/assessment/${assessmentId}/answers`,
        { question_id: questionId, answer: value },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.progress !== undefined) setProgress(res.data.progress);
      })
      .catch((err) => console.error("Error saving answer:", err));
  };

  // ---------------- Submit assessment ----------------
  const handleSubmit = async () => {
    setSubmitting(true); // show loading overlay
    try {
      const res = await axios.post(
        `${API_BASE_URL}/submit_assessment/${assessmentId}`,
        {},
        { withCredentials: true }
      );

      console.log("Submission successful:", res.data);

      // stop loading and show modal
      setSubmitting(false);
      setShowCompleteModal(true);

      // optional: store recommended strand in local state if you want to display
      // setRecommendedStrand(res.data.recommended_strand);
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setSubmitting(false); // stop loading even if error
    }
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    navigate("/userdashboardhome");
  };

  const ScaleOption = ({ value, isSelected, onChange, label }) => (
    <div className="scale-option">
      {label && <span className="scale-label">{label}</span>}
      <button
        type="button"
        className={`scale-button ${isSelected ? "selected" : ""} scale-${value}`}
        onClick={() => onChange(value)}
      >
        {value}
      </button>
    </div>
  );

  const allAnswered = currentQuestions.every((q) => answers[q.question_id] !== undefined);

  // ---------------- Loading screen ----------------
  if (loading) return <div className="loading">Loading assessment...</div>;

  return (
    <div className="take-assessment-container">
      <Header />
      <div className="take-assessment-main-layout">
        <UserDashboardSidebar activeItem="Assessment" progress={progress} />
        <div className="take-assessment-main-content">
          <div className="take-assessment-content-section">
            {step === 0 && !existingAssessment && (
              <div className="buffer-question">
                <h2>Are you currently a 1st year college student?</h2>
                <div className="buffer-options">
                  <button
                    className={`buffer-btn ${isFirstYear === true ? "selected" : ""}`}
                    onClick={() => setIsFirstYear(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`buffer-btn ${isFirstYear === false ? "selected" : ""}`}
                    onClick={() => setIsFirstYear(false)}
                  >
                    No
                  </button>
                </div>

                {isFirstYear && (
                  <div className="course-dropdown">
                    <label>Select your course:</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  className="nav-btn next-btn"
                  onClick={handleStartAssessment}
                  disabled={!userId || isFirstYear === null || (isFirstYear && !selectedCourse)}
                >
                  Start Assessment →
                </button>
              </div>
            )}

            {step > 0 && (
              <>
                
                <div className="questions-container">
                  {currentQuestions.map((q, index) => {
                    const selectedAnswer = answers[q.question_id];
                    const isError = validationError === q.question_id;

                    return (
                      <div
                        key={q.question_id}
                        ref={(el) => (questionRefs.current[q.question_id] = el)}
                        className={`question-item ${isError ? "error" : ""}`}
                      >
                        {isError && (
                          <p className="error-message">⚠ Please answer this question before continuing</p>
                        )}
                        <h3 className="question-text">
                          {startIndex + index + 1}. {q.question_text}
                        </h3>
                        <div className="scale-container">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <ScaleOption
                              key={val}
                              value={val}
                              isSelected={selectedAnswer === val}
                              onChange={(v) => {
                                handleAnswerChange(q.question_id, v);
                                if (validationError === q.question_id) setValidationError(null);
                              }}
                              label={val === 1 ? "Disagree" : val === 5 ? "Agree" : ""}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="nav-btn-container">
                  {currentPage < totalPages ? (
                    <button
                      className="nav-btn next-btn"
                      onClick={() => {
                        const firstUnanswered = currentQuestions.find(
                          (q) => answers[q.question_id] === undefined
                        );

                        if (firstUnanswered) {
                          setValidationError(firstUnanswered.question_id); // mark as error
                          questionRefs.current[firstUnanswered.question_id]?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        } else {
                          setValidationError(null);
                          setStep(step + 1);
                        }
                      }}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      className="nav-btn submit-btn"
                      onClick={() => {
                        const firstUnanswered = currentQuestions.find(
                          (q) => answers[q.question_id] === undefined
                        );

                        if (firstUnanswered) {
                          setValidationError(firstUnanswered.question_id);
                          questionRefs.current[firstUnanswered.question_id]?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        } else {
                          setValidationError(null);
                          handleSubmit();
                        }
                      }}
                    >
                      Submit Assessment ✅
                    </button>
                  )}
                </div>

                <div className="progress-indicator">
                  Page {currentPage} of {totalPages} | Progress: {progress.toFixed(0)}%
                </div>
              </>
            )}
          </div>

          <div className="take-assessment-footer">
            <p className="take-assessment-tagline">
              "Aligned for <span className="highlight-orange">Success</span>."
            </p>
            <p className="take-assessment-copyright">
              Copyright © 2025 PathFinder. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {submitting && (
        <div className="loading-overlay">
          <div className="loading-message">Assessing your answers...</div>
        </div>
      )}

      {/* Completion modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Assessment Complete 🎉</h2>
            <p>Your recommended strand has been generated.</p>
            <button className="confirm-btn" onClick={handleConfirmComplete}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardTakeAssessment;
