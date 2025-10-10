import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserDashboardSidebar from "./component/UserDashboardSidebar";
import UserDashboardHeader from "./component/UserDashboardHeader";
import "./UserDashboardTakeAssessment.css";

const UserDashboardTakeAssessmentCopy = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const questionRefs = useRef({});
  const [validationError, setValidationError] = useState(null);
  const questionsPerPage = 15;
  const currentPage = step;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // ---------------- Fetch initial data ----------------
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/userlogincopy");
        return;
      }

      try {
        const meRes = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(meRes.data.user_id);

        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const datasetId = datasetRes.data.data_set_id || null;

        if (!datasetId) {
          console.error("No active dataset found");
          setLoading(false);
          return;
        }
        const coursesRes = await axios.get(`${API_BASE_URL}/courses`);
        setCourses(coursesRes.data || []);
        if (!datasetRes.data.question_set_id) return console.error("Active dataset has no question set");
        setDatasetId(datasetRes.data.data_set_id)
        const questionsRes = await axios.get(
          `${API_BASE_URL}/question-sets/${datasetRes.data.question_set_id}`
        );
        const data = questionsRes.data;
        setQuestions(data.questions || []);
        setTotalPages(Math.ceil((data.questions || []).length / questionsPerPage));

        const res = await axios.get(
          `${API_BASE_URL}/progress/${meRes.data.user_id}/${datasetId}`,
          { headers: { Authorization: `Bearer ${token}` }, }
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
            { headers: { Authorization: `Bearer ${token}` }, }
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
    fetchInitialData();
  }, [token, navigate, API_BASE_URL]);

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
  const handleStartAssessment = async () => {
  if (!userId || !datasetId) return;

  try {
    if (assessmentId) {
      setStep(1);
      return;
    }
    const payload = {
      user_id: userId,
      data_set_id: datasetId,
      is_first_year: isFirstYear,
      course_id: selectedCourse || null,
    };
    const res = await axios.post(`${API_BASE_URL}/assessments`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssessmentId(res.data.assessment_id);
    setStep(1); // ✅ Move to questions immediately
  } catch (err) {
    console.error("Error starting assessment:", err);
    alert("Failed to start assessment. Please try again.");
  }
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
        { headers: { Authorization: `Bearer ${token}` }, }
      )
      .then((res) => {
        if (res.data.progress !== undefined) setProgress(res.data.progress);
      })
      .catch((err) => console.error("Error saving answer:", err));
  };

  // ---------------- Submit assessment ----------------
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/submit_assessment/${assessmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, }
      );

      console.log("Submission successful:", res.data);

      setSubmitting(false);
      setShowCompleteModal(true);
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setSubmitting(false);
    }
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    navigate("/userdashboardhomecopy");
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

  // ---------------- Loading screen ----------------
  if (loading) {
    return (
      <div className="take-assessment-container">
        <UserDashboardHeader />
        <div className="take-assessment-main-layout">
          <UserDashboardSidebar activeItem="Assessment" />
          <div className="take-assessment-main-content">
            <div className="take-assessment-loading">
              <div className="loading-spinner"></div>
              <p>Loading assessment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="take-assessment-container">
      <UserDashboardHeader />
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
                          {[
                            { val: 1, label: "Strongly Disagree" },
                            { val: 2, label: "Disagree" },
                            { val: 3, label: "Neutral" },
                            { val: 4, label: "Agree" },
                            { val: 5, label: "Strongly Agree" }
                          ].map(({ val, label }) => (
                            <ScaleOption
                              key={val}
                              value={val}
                              isSelected={selectedAnswer === val}
                              onChange={(v) => {
                                handleAnswerChange(q.question_id, v);
                                if (validationError === q.question_id) setValidationError(null);
                              }}
                              label={label}
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
                          setValidationError(firstUnanswered.question_id);
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
            <p className="take-assessment-copyright">
              © 2025 Strandify. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {submitting && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-message">Assessing your answers...</div>
        </div>
      )}

      {/* Completion modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Assessment Complete!</h2>
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

export default UserDashboardTakeAssessmentCopy;