import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UserDashboardSidebar.css';
import dashboardIcon from '../../assets/DashboardIcon.png';
import assessmentIcon from '../../assets/AssessmentIcon.png';
import statisticsIcon from '../../assets/StatisticsIcon.png';
import coursesIcon from '../../assets/CoursesIcon.png';
import careersIcon from '../../assets/CareersIcon.png';

const UserDashboardSidebar = ({ activeItem = 'Dashboard', progress }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/userdashboardhome', iconSrc: dashboardIcon },
    { name: 'Assessment', path: '/userdashboardassessment', iconSrc: assessmentIcon },
    { name: 'Statistics', path: '/userdashboardhome', iconSrc: statisticsIcon },
    { name: 'Courses', path: '/userdashboardhome', iconSrc: coursesIcon },
    { name: 'Careers', path: '/userdashboardhome', iconSrc: careersIcon },
  ];

  const handleNavigate = (target) => {
    if (progress > 0 && progress < 100) {
      const leave = window.confirm(
        "You have unsaved progress. Are you sure you want to leave?"
      );
      if (!leave) return;
    }
    navigate(target);
  };

  return (
    <div className="user-dashboard-sidebar">
      <div className="user-dashboard-sidebar-content">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`user-dashboard-menu-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => handleNavigate(item.path)} 
            style={{ cursor: 'pointer' }}
          >
            <img
              src={item.iconSrc}
              alt={`${item.name} icon`}
              width={20}
              height={20}
              style={{ filter: 'brightness(0) saturate(100%) invert(1)', opacity: 0.7 }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UserDashboardSidebar;