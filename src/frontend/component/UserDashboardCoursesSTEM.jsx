import React from 'react';
import './css/UserDashboardCoursesSTEM.css';

// Course Card Component
const CourseCard = ({ title, duration, description, matchPercentage, matchText }) => {
  return (
    <div className="stem-course-card">
      <div className="stem-course-card-header">
        <h3 className="stem-course-title">{title}</h3>
        <p className="stem-course-duration"><strong>Duration:</strong> {duration}</p>
        <p className="stem-course-description">
          <strong>What you'll learn:</strong> {description}
        </p>
      </div>
      
      <div className="stem-course-match-section">
        <div className="stem-progress-bar-container">
          <div 
            className="stem-progress-bar-fill" 
            style={{ width: `100%` }}
          />
        </div>
        <p className="stem-match-text">{matchText}</p>
      </div>
    </div>
  );
};

// STEM Courses Content Component
const UserDashboardCoursesSTEM = () => {
  const courses = [
    {
      title: "BS Computer Science",
      duration: "4 Years",
      description: "Programming, App Development, Artificial Intelligence, Software Engineering.",
      matchText: "Perfect for tech enthusiasts and Programmers!"
    },
    {
      title: "BS Civil Engineering",
      duration: "4 Years",
      description: "Designing Infrastructure projects, building roads, buildings, and bridges.",
      matchText: "Great for problem solvers and world builders!"
    },
    {
      title: "BS Data Science",
      duration: "4 Years",
      description: "Analyzing Big Data, creating Predictions, and help companies make Smart Decisions.",
      matchText: "Perfect for math lovers!"
    },
    {
      title: "Doctor of Dental Medicine",
      duration: "6+ Years",
      description: "Human Biology, Disease Treatment, and help saving lives in general.",
      matchText: "For science lovers with a passion of helping others!"
    }
  ];

  return (
    <div className="stem-courses-content-section">
      <h1 className="stem-courses-page-title">STEM Courses Perfect for You</h1>
      <p className="stem-courses-subtitle">
        Based on your STEM recommendation, here are college courses that will match your interests and skills:
      </p>

      {/* Course Cards */}
      <div className="stem-courses-list">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            duration={course.duration}
            description={course.description}
            matchPercentage={course.matchPercentage}
            matchText={course.matchText}
          />
        ))}
      </div>

      {/* Why These Programs Section */}
      <div className="stem-why-programs-section">
        <h2 className="stem-why-programs-title">Why These Programs Match Your STEM Profile</h2>
        <p className="stem-why-programs-text">
          All these programs are available at University of the East-Manila and are specifically 
          aligned with the STEM strand. They require strong analytical thinking, problem-solving 
          skills, and scientific reasoning - exactly what your assessment revealed about your abilities.
        </p>
      </div>
    </div>
  );
};

export default UserDashboardCoursesSTEM;