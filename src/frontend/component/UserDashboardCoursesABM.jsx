import React from 'react';
import './css/UserDashboardCoursesABM.css';

// Course Card Component
const CourseCard = ({ title, duration, description, matchPercentage, matchText }) => {
  return (
    <div className="abm-course-card">
      <div className="abm-course-card-header">
        <h3 className="abm-course-title">{title}</h3>
        <p className="abm-course-duration"><strong>Duration:</strong> {duration}</p>
        <p className="abm-course-description">
          <strong>What you'll learn:</strong> {description}
        </p>
      </div>
      
      <div className="abm-course-match-section">
        <div className="abm-progress-bar-container">
          <div 
            className="abm-progress-bar-fill" 
            style={{ width: `100%` }}
          />
        </div>
        <p className="abm-match-text">{matchText}</p>
      </div>
    </div>
  );
};

// ABM Courses Content Component
const UserDashboardCoursesABM = () => {
  const courses = [
    {
      title: "BS in Accountancy (BSA)",
      duration: "4 Years",
      description: "Financial accounting, auditing, taxation, and business law.",
      matchText: "Perfect for analytical business minds!"
    },
    {
      title: "BS in Management Accounting (BSMA)",
      duration: "4 Years",
  description: "Centers on internal business decision-making, cost management, budgeting, and performance evaluation.",
  matchText: "Perfect for detail-oriented thinkers who enjoy analyzing numbers to improve business operations!"
    },
    {
      title: "BS in Financial Management(BSFM)",
      duration: "4 Years",
      description: "Covers investment analysis, financial planning, corporate finance, and risk management.",
  matchText: "Best for strategic thinkers who aim to excel in banking, finance, or investment industries!"
    },
    {
      title: "BS Legal Management",
      duration: "6+ Years",
      description: "Business law, legal procedures, and regulatory compliance.",
      matchText: "Excellent pre-law preparation!"
    }
  ];

  return (
    <div className="abm-courses-content-section">
      <h1 className="abm-courses-page-title">ABM Courses Perfect for You</h1>
      <p className="abm-courses-subtitle">
        Based on your ABM recommendation, here are college courses that will match your interests and skills:
      </p>

      {/* Course Cards */}
      <div className="abm-courses-list">
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
      <div className="abm-why-programs-section">
        <h2 className="abm-why-programs-title">Why These Programs Match Your ABM Profile</h2>
        <p className="abm-why-programs-text">
          All these programs are available at University of the East-Manila and are specifically 
          aligned with the ABM strand. They require strong business acumen, financial literacy, 
          leadership skills, and strategic thinking - exactly what your assessment revealed about your abilities.
        </p>
      </div>
    </div>
  );
};

export default UserDashboardCoursesABM;