import React from 'react';
import './css/UserDashboardCoursesHUMSS.css';

// Course Card Component
const CourseCard = ({ title, duration, description, matchPercentage, matchText }) => {
  return (
    <div className="humss-course-card">
      <div className="humss-course-card-header">
        <h3 className="humss-course-title">{title}</h3>
        <p className="humss-course-duration"><strong>Duration:</strong> {duration}</p>
        <p className="humss-course-description">
          <strong>What you'll learn:</strong> {description}
        </p>
      </div>
      
      <div className="humss-course-match-section">
        <div className="humss-progress-bar-container">
          <div 
            className="humss-progress-bar-fill" 
            style={{ width: `100%` }}
          />
        </div>
        <p className="humss-match-text">{matchText}</p>
      </div>
    </div>
  );
};

// HUMSS Courses Content Component
const UserDashboardCoursesHUMSS = () => {
  const courses = [
    {
      title: "BS Psychology",
      duration: "4 years",
      description: "Human behavior, mental processes, counseling, and psychological research",
      matchText: "Perfect for understanding people!"
    },
    {
      title: "Bachelor of Elementary Education",
      duration: "4 years",
      description: "Child development, teaching methods, and elementary curriculum design",
      matchText: "Great if you want to shape young minds!"
    },
    {
      title: "BA Broadcasting",
      duration: "4 years",
      description: "Media production, journalism, communication arts, and broadcasting techniques",
      matchText: "Perfect if you want to tell important stories!"
    },
    {
      title: "BA Political Science",
      duration: "4 years",
      description: "Government systems, public policy, international relations, and political theory",
      matchText: "Perfect if you want to lead social change!"
    }
  ];

  return (
    <div className="humss-courses-content-section">
      <h1 className="humss-courses-page-title">HUMSS Courses Perfect for You</h1>
      <p className="humss-courses-subtitle">
        Based on your HUMSS recommendation, here are college courses that will match your interests and skills:
      </p>

      {/* Course Cards */}
      <div className="humss-courses-list">
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
      <div className="humss-why-programs-section">
        <h2 className="humss-why-programs-title">Why These Programs Match Your HUMSS Profile</h2>
        <p className="humss-why-programs-text">
          All these programs are available at University of the East-Manila and are specifically 
          aligned with the HUMSS strand. They require strong communication skills, social awareness, 
          and creative thinking - exactly what your assessment revealed about your abilities and interests.
        </p>
      </div>
    </div>
  );
};

export default UserDashboardCoursesHUMSS;