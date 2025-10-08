import React from 'react';
import './css/UserDashboardCareersHUMSS.css';
import { useNavigate } from 'react-router-dom';

// Career Card Component
const CareerCard = ({ title, description, salary, growth, borderColor, icon }) => {
  return (
    <div className={`humss-career-card ${borderColor}`}>
      <div className="humss-career-content">
        <div className="humss-career-info">
          <h3 className="humss-career-title">{title}</h3>
          <p className="humss-career-description">
            <strong>What you'll do:</strong> {description}
          </p>
          <p className="humss-career-salary">
            <strong>Starting Salary:</strong> {salary}
          </p>
          <p className="humss-career-growth">
            <strong>Growth:</strong> {growth}
          </p>
        </div>
        <div className="humss-career-icon">
          <img src={icon} alt={title} />
        </div>
      </div>
    </div>
  );
};

// HUMSS Careers Content Component
const UserDashboardCareersHUMSS = () => {
  const navigate = useNavigate();
  const careers = [
    {
      title: "Teacher / Educator",
      description: "Educate and inspire students, develop curriculum, and shape future generations",
      salary: "₱250,000 - ₱400,000 per year",
      growth: "Always needed with strong job security and fulfilling impact!",
      borderColor: "orange-border",
      icon: "https://cdn-icons-png.flaticon.com/512/3976/3976625.png"
    },
    {
      title: "Psychologist / Counselor",
      description: "Help people overcome challenges, provide therapy, and improve mental health",
      salary: "₱300,000 - ₱500,000 per year",
      growth: "Growing demand as mental health awareness increases!",
      borderColor: "orange-border",
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png"
    },
    {
      title: "Journalist / Broadcaster",
      description: "Report news, investigate stories, and inform the public through media",
      salary: "₱280,000 - ₱450,000 per year",
      growth: "Evolving field with digital media opportunities!",
      borderColor: "blue-border",
      icon: "https://cdn-icons-png.flaticon.com/512/3426/3426653.png"
    },
    {
      title: "Government Officer / Diplomat",
      description: "Shape public policy, represent the country, and serve communities",
      salary: "₱320,000 - ₱550,000 per year",
      growth: "Career stability and opportunity to create social change!",
      borderColor: "purple-border",
      icon: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png"
    }
  ];

  return (
    <div className="humss-careers-content-section">
      <h1 className="humss-careers-page-title">Your Future HUMSS Career Paths</h1>
      <p className="humss-careers-subtitle">
        Here are exciting careers waiting for you after completing HUMSS and college:
      </p>

      {/* Career Cards */}
      <div className="humss-careers-list">
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
      <div className="humss-why-careers-section">
        <h2 className="humss-why-careers-title">Why these careers are perfect for you:</h2>
        <ul className="humss-why-careers-list">
          <li>✓ Your strong communication skills will help you connect with people effectively</li>
          <li>✓ Your social awareness makes you ideal for understanding community needs</li>
          <li>✓ Your critical thinking helps analyze complex social issues</li>
          <li>✓ HUMSS careers offer meaningful impact on society and individuals</li>
          <li>✓ You can advocate for change and improve people's lives</li>
          <li>✓ These fields value the creative and empathetic skills you've developed</li>
        </ul>
        <p className="humss-reassessment-text">
          We understand if you are having second thoughts, if you wish to reevaluate, 
          you are free to take the assessment again.
        </p>
      </div>

      {/* Retake Button */}
      <div className="humss-retake-section">
        <button className="humss-retake-btn"
        onClick={() => navigate('/userdashboardassessment')}
        >
          TAKE THE ASSESSMENT AGAIN?
        </button>
      </div>
    </div>
  );
};

export default UserDashboardCareersHUMSS;