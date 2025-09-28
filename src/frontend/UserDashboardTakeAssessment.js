import React, { useState } from 'react';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import './UserDashboardTakeAssessment.css';

// Header Component
const Header = () => {
  return (
    <div className="take-assessment-header">
      <div className="take-assessment-logo-section">
        <div className="take-assessment-logo">
          <span className="take-assessment-graduation-cap">🎓</span>
          <span className="take-assessment-logo-text">PathFinder</span>
        </div>
      </div>
      <div className="take-assessment-header-actions">
        <button className="take-assessment-create-btn">
          + Create
        </button>
        <div className="take-assessment-profile-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
            alt="Profile" 
          />
        </div>
      </div>
    </div>
  );
};

// Assessment questions data
const assessmentQuestions = [
  // Page 1 (1-15)
  "I enjoy solving complex mathematical and logical problems.",
  "I am naturally curious about how things work.",
  "I enjoy designing, building, or programming projects.",
  "I am confident in my ability to analyze and interpret data.",
  "I can think critically to solve real-world problems.",
  "I perform well in mathematics or science subjects.",
  "I like working with technology and digital tools.",
  "I enjoy conducting experiments or research.",
  "I am good at identifying patterns in information.",
  "I prefer working with facts and concrete data.",
  "I like to understand the 'why' behind everything.",
  "I enjoy creating detailed plans and strategies.",
  "I am comfortable working with numbers and statistics.",
  "I like to test theories and hypotheses.",
  "I enjoy learning about new scientific discoveries.",
  
  // Page 2 (16-30)
  "I am good at communicating complex ideas clearly.",
  "I enjoy helping others learn new things.",
  "I like working in teams and collaborating with others.",
  "I am comfortable speaking in front of groups.",
  "I enjoy creative writing or storytelling.",
  "I like organizing events or activities.",
  "I am good at understanding other people's emotions.",
  "I enjoy debates and discussions about important topics.",
  "I like to mentor or guide younger students.",
  "I am interested in different cultures and languages.",
  "I enjoy reading literature and analyzing texts.",
  "I am good at mediating conflicts between people.",
  "I like to volunteer for community service projects.",
  "I enjoy learning about history and social issues.",
  "I am comfortable adapting to new situations and changes."
];

// Main TakeAssessment Component
const UserDashboardTakeAssessment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  
  const questionsPerPage = 15;
  const totalPages = Math.ceil(assessmentQuestions.length / questionsPerPage);
  
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = assessmentQuestions.slice(startIndex, startIndex + questionsPerPage);

  const handleAnswerChange = (questionIndex, value) => {
    const globalIndex = startIndex + questionIndex;
    setAnswers(prev => ({
      ...prev,
      [globalIndex]: value
    }));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Handle assessment completion
    console.log('Assessment completed:', answers);
    alert('Assessment completed! Redirecting to results...');
  };

  const ScaleOption = ({ value, isSelected, onChange, label }) => (
    <div className="scale-option">
      {label && <span className="scale-label">{label}</span>}
      <button
        className={`scale-button ${isSelected ? 'selected' : ''} scale-${value}`}
        onClick={() => onChange(value)}
      />
    </div>
  );

  return (
    <div className="take-assessment-container">
      <Header />
      <div className="take-assessment-main-layout">
        <UserDashboardSidebar activeItem="Assessment" />
        <div className="take-assessment-main-content">
          <div className="take-assessment-content-section">
            
            {/* Questions */}
            <div className="questions-container">
              {currentQuestions.map((question, index) => {
                const globalIndex = startIndex + index;
                const selectedAnswer = answers[globalIndex];
                
                return (
                  <div key={globalIndex} className="question-item">
                    <h3 className="question-text">
                      {globalIndex + 1}. {question}
                    </h3>
                    
                    <div className="scale-container">
                      <ScaleOption
                        value={1}
                        isSelected={selectedAnswer === 1}
                        onChange={(value) => handleAnswerChange(index, value)}
                        label="Disagree"
                      />
                      <ScaleOption
                        value={2}
                        isSelected={selectedAnswer === 2}
                        onChange={(value) => handleAnswerChange(index, value)}
                      />
                      <ScaleOption
                        value={3}
                        isSelected={selectedAnswer === 3}
                        onChange={(value) => handleAnswerChange(index, value)}
                      />
                      <ScaleOption
                        value={4}
                        isSelected={selectedAnswer === 4}
                        onChange={(value) => handleAnswerChange(index, value)}
                      />
                      <ScaleOption
                        value={5}
                        isSelected={selectedAnswer === 5}
                        onChange={(value) => handleAnswerChange(index, value)}
                        label="Agree"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="navigation-section">
              {currentPage > 1 && (
                <button className="nav-btn previous-btn" onClick={handlePrevious}>
                  ← Previous
                </button>
              )}
              
              {currentPage < totalPages ? (
                <button className="nav-btn next-btn" onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button className="nav-btn submit-btn" onClick={handleSubmit}>
                  Submit Assessment
                </button>
              )}
            </div>

            {/* Progress indicator */}
            <div className="progress-indicator">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Footer */}
          <div className="take-assessment-footer">
            <p className="take-assessment-tagline">
              "Aligned for <span className="highlight-orange">Success</span>."
            </p>
            <p className="take-assessment-copyright">Copyright © 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardTakeAssessment;