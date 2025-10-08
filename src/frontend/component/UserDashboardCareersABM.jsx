import React from 'react';
import './css/UserDashboardCareersABM.css';
import { useNavigate } from 'react-router-dom';
// Career Card Component
const CareerCard = ({ title, description, salary, growth, borderColor, icon }) => {
  return (
    <div className={`abm-career-card ${borderColor}`}>
      <div className="abm-career-content">
        <div className="abm-career-info">
          <h3 className="abm-career-title">{title}</h3>
          <p className="abm-career-description">
            <strong>What you'll do:</strong> {description}
          </p>
          <p className="abm-career-salary">
            <strong>Starting Salary:</strong> {salary}
          </p>
          <p className="abm-career-growth">
            <strong>Growth:</strong> {growth}
          </p>
        </div>
        <div className="abm-career-icon">
          <img src={icon} alt={title} />
        </div>
      </div>
    </div>
  );
};

// ABM Careers Content Component
const UserDashboardCareersABM = () => {
  const navigate = useNavigate();
  const careers = [
    {
      title: "Certified Public Accountant (CPA)",
      description: "Manage financial records, conduct audits, and provide tax consultation for businesses",
      salary: "₱350,000 - ₱600,000 per year",
      growth: "Always in demand as businesses need financial expertise!",
      borderColor: "purple-border",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
    },
    {
      title: "Hotel Manager",
      description: "Oversee hotel operations, manage staff, and ensure excellent customer service.",
      salary: "₱300,000 - ₱500,000 per year",
      growth: "Tourism industry is growing rapidly in the Philippines!",
      borderColor: "blue-border",
      icon: "https://cdn-icons-png.flaticon.com/512/2343/2343778.png"
    },
    {
      title: "Business Analyst",
      description: "Analyze business operations, identify improvements, and recommend strategic solutions",
      salary: "₱350,000 - ₱550,000 per year",
      growth: "Essential role as businesses focus on efficiency!",
      borderColor: "green-border",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
    },
    {
      title: "Travel and Tourism Manager",
      description: "Plan travel packages, manage tourism operations, and promote destinations",
      salary: "₱280,000 - ₱450,000 per year",
      growth: "Expanding opportunities as travel industry recovers!",
      borderColor: "orange-border",
      icon: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
    }
  ];

  return (
    <div className="abm-careers-content-section">
      <h1 className="abm-careers-page-title">Your Future ABM Career Paths</h1>
      <p className="abm-careers-subtitle">
        Here are exciting careers waiting for you after completing ABM and college:
      </p>

      {/* Career Cards */}
      <div className="abm-careers-list">
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
      <div className="abm-why-careers-section">
        <h2 className="abm-why-careers-title">Why these careers are perfect for you:</h2>
        <ul className="abm-why-careers-list">
          <li>✓ Your strong business acumen will help you understand market dynamics</li>
          <li>✓ Your organizational skills are perfect for management roles</li>
          <li>✓ Your practical problem-solving approach fits business environments</li>
          <li>✓ ABM careers offer excellent growth opportunities and job security</li>
          <li>✓ You can make strategic decisions that impact business success</li>
          <li>✓ These fields require the analytical and financial skills you've developed</li>
        </ul>
        <p className="abm-reassessment-text">
          We understand if you are having second thoughts, if you wish to reevaluate, 
          you are free to take the assessment again.
        </p>
      </div>

      {/* Retake Button */}
      <div className="abm-retake-section">
        <button className="abm-retake-btn"
        onClick={() => navigate('/userdashboardassessment')}
        >
          TAKE THE ASSESSMENT AGAIN?
        </button>
      </div>
    </div>
  );
};

export default UserDashboardCareersABM;