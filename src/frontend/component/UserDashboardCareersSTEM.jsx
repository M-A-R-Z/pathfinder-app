import React from 'react';
import './css/UserDashboardCareersSTEM.css';
import { useNavigate } from 'react-router-dom';

// Career Card Component
const CareerCard = ({ title, description, salary, growth, borderColor, icon }) => {
  return (
    <div className={`stem-career-card ${borderColor}`}>
      <div className="stem-career-content">
        <div className="stem-career-info">
          <h3 className="stem-career-title">{title}</h3>
          <p className="stem-career-description">
            <strong>What you'll do:</strong> {description}
          </p>
          <p className="stem-career-salary">
            <strong>Starting Salary:</strong> {salary}
          </p>
          <p className="stem-career-growth">
            <strong>Growth:</strong> {growth}
          </p>
        </div>
        <div className="stem-career-icon">
          <img src={icon} alt={title} />
        </div>
      </div>
    </div>
  );
};

// STEM Careers Content Component
const UserDashboardCareersSTEM = () => {
  const navigate = useNavigate();
  const careers = [
    {
      title: "Software Developer",
      description: "Create Mobile Apps, websites, software that millions of people will use.",
      salary: "PHP 400,000 - PHP 800,000 per year",
      growth: "Expected to grow 30% in the next 10 years!",
      borderColor: "green-border",
      icon: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
    },
    {
      title: "Research Scientist",
      description: "Discover new medicines, technologies, or solutions to world problems",
      salary: "₱500,000 - ₱900,000 per year",
      growth: "Always needed as we face new challenges!",
      borderColor: "blue-border",
      icon: "https://cdn-icons-png.flaticon.com/512/3050/3050155.png"
    },
    {
      title: "Civil Engineer",
      description: "Design and build bridges, buildings, and infrastructure that lasts generations",
      salary: "₱350,000 - ₱700,000 per year",
      growth: "High demand as the Philippines continues developing!",
      borderColor: "orange-border",
      icon: "https://cdn-icons-png.flaticon.com/512/2138/2138440.png"
    },
    {
      title: "Medical Doctor",
      description: "Diagnose illnesses, treat patients, and save lives every day",
      salary: "₱600,000 - ₱1,200,000 per year",
      growth: "Always respected and needed in society!",
      borderColor: "red-border",
      icon: "https://cdn-icons-png.flaticon.com/512/2785/2785482.png"
    }
  ];

  return (
    <div className="stem-careers-content-section">
      <h1 className="stem-careers-page-title">Your Future STEM Career Paths</h1>
      <p className="stem-careers-subtitle">
        Here are exciting careers waiting for you after completing STEM and college:
      </p>

      {/* Career Cards */}
      <div className="stem-careers-list">
        {careers.map((career, index) => (
          <CareerCard
            key={index}
            title={career.title}
            description={career.description}
            salary={career.salary}
            growth={career.growth}
            borderColor={career.borderColor}
            icon={career.icon}
          />
        ))}
      </div>

      {/* Why These Careers Section */}
      <div className="stem-why-careers-section">
        <h2 className="stem-why-careers-title">Why these careers are perfect for you:</h2>
        <ul className="stem-why-careers-list">
          <li>✓ Your strong problem solving skills help you tackle complex challenges.</li>
          <li>✓ Your interest in technology matches the growing digital world.</li>
          <li>✓ Your logical thinking is perfect for scientific and technical work.</li>
          <li>✓ STEM Careers offer high job security and good salaries.</li>
          <li>✓ You can make a real difference in people's lives and society.</li>
          <li>✓ These fields are constantly growing and evolving.</li>
        </ul>
        <p className="stem-reassessment-text">
          We understand if you are having second thoughts, if you wish to reevaluate, 
          you are free to take the assessment again.
        </p>
      </div>

      {/* Retake Button */}
      <div className="stem-retake-section">
        <button className="stem-retake-btn"
        onClick={() => navigate('/userdashboardassessment')}>

          TAKE THE ASSESSMENT AGAIN?
        </button>
      </div>
    </div>
  );
};

export default UserDashboardCareersSTEM;