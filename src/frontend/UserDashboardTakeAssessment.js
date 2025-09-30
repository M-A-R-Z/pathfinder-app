import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [step, setStep] = useState(0);
  const [isFirstYear, setIsFirstYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [answers, setAnswers] = useState({});
  const [datasetId, setDatasetId] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);
  const [progress, setProgress] = useState(0);

  const userId = 1; // TODO: replace with logged-in user
  const questionsPerPage = 15;

  const currentPage = step;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  // Fetch courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Fetch active dataset + questions
  useEffect(() => {
    axios
      .get("http://localhost:5000/active-dataset")
      .then((res) => {
        const active = res.data;
        if (!active.question_set_id) {
          console.error("Active dataset has no question set");
          return;
        }
        setDatasetId(active.data_set_id);
        return axios.get(
          `http://localhost:5000/question-sets/${active.question_set_id}`
        );
      })
      .then((res) => {
        if (res) {
          const data = res.data;
          setQuestions(data.questions || []);
          setTotalPages(Math.ceil((data.questions || []).length / questionsPerPage));
        }
      })
      .catch((err) =>
        console.error("Error fetching active dataset/questions:", err)
      );
  }, []);

  // Fetch saved progress when returning
  useEffect(() => {
    if (!assessmentId) return;
    axios
      .get(`http://localhost:5000/assessment/${assessmentId}/progress`)
      .then((res) => {
        setProgress(res.data.progress || 0);
      })
      .catch((err) => console.error("Error fetching saved progress:", err));
  }, [assessmentId]);

  // Handle answer change (autosave)
  const handleAnswerChange = (questionId, value) => {
    const newAnswers = {
      ...answers,
      [questionId]: value,
    };
    setAnswers(newAnswers);

    // Save progress immediately
    if (assessmentId) {
      const answeredCount = Object.keys(newAnswers).length;
      const totalCount = questions.length;
      const progressValue = (answeredCount / totalCount) * 100;

      setProgress(progressValue);

      axios.put(
        `http://localhost:5000/assessment/${assessmentId}/progress`,
        { progress: progressValue },
        { withCredentials: true }
      );
    }
  };

  // Handle submit
  const handleSubmit = () => {
    const payload = {
      user_id: userId,
      dataset_id: datasetId,
      is_first_year: isFirstYear,
      course_id: selectedCourse || null,
      answers: Object.entries(answers).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        answer: ans,
      })),
    };

    axios
      .post("http://localhost:5000/assessments", payload)
      .then((res) => {
        setAssessmentId(res.data.assessment_id);
        alert("Assessment completed! Redirecting to results...");
        // TODO: navigate to results page
      })
      .catch((err) => console.error("Error submitting assessment:", err));
  };

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (progress > 0 && progress < 100) {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to leave? Your progress will be saved.";
        // save progress one last time
        if (assessmentId) {
          axios.put(
            `http://localhost:5000/assessment/${assessmentId}/progress`,
            { progress },
            { withCredentials: true }
          );
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [progress, assessmentId]);

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

  const allAnswered = currentQuestions.every(
    (q) => answers[q.question_id] !== undefined
  );

  return (
    <div className="take-assessment-container">
      <Header />
      <div className="take-assessment-main-layout">
        <UserDashboardSidebar activeItem="Assessment" />
        <div className="take-assessment-main-content">
          <div className="take-assessment-content-section">
            {/* Step 0: Buffer Page */}
            {step === 0 && (
              <div className="buffer-question">
                <h2>Are you currently a 1st year college student?</h2>
                <div className="buffer-options">
                  <button
                    className={`buffer-btn ${
                      isFirstYear === true ? "selected" : ""
                    }`}
                    onClick={() => setIsFirstYear(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`buffer-btn ${
                      isFirstYear === false ? "selected" : ""
                    }`}
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
                  onClick={() => setStep(1)}
                  disabled={
                    isFirstYear === null || (isFirstYear && !selectedCourse)
                  }
                >
                  Start Assessment →
                </button>
              </div>
            )}

            {/* Questions */}
            {step > 0 && (
              <>
                <div className="questions-container">
                  {currentQuestions.map((q, index) => {
                    const selectedAnswer = answers[q.question_id];
                    return (
                      <div key={q.question_id} className="question-item">
                        <h3 className="question-text">
                          {startIndex + index + 1}. {q.question_text}
                        </h3>
                        <div className="scale-container">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <ScaleOption
                              key={val}
                              value={val}
                              isSelected={selectedAnswer === val}
                              onChange={(v) =>
                                handleAnswerChange(q.question_id, v)
                              }
                              label={
                                val === 1 ? "Disagree" : val === 5 ? "Agree" : ""
                              }
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="navigation-section">
                  {currentPage > 1 ? (
                    <button
                      className="nav-btn previous-btn"
                      onClick={() => setStep(step - 1)}
                    >
                      ← Previous
                    </button>
                  ) : (
                    <button
                      className="nav-btn previous-btn"
                      onClick={() => setStep(0)}
                    >
                      ← Back
                    </button>
                  )}

                  {currentPage < totalPages ? (
                    <button
                      className="nav-btn next-btn"
                      onClick={() => setStep(step + 1)}
                      disabled={!allAnswered}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      className="nav-btn submit-btn"
                      onClick={handleSubmit}
                      disabled={!allAnswered}
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>

                <div className="progress-indicator">
                  Page {currentPage} of {totalPages} | Progress:{" "}
                  {progress.toFixed(0)}%
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
    </div>
  );
};

export default UserDashboardTakeAssessment;
