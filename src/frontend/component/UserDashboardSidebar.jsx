import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UserDashboardSidebar.css';
import dashboardIcon from '../../assets/DashboardIcon.png';
import assessmentIcon from '../../assets/AssessmentIcon.png';
import statisticsIcon from '../../assets/StatisticsIcon.png';
import coursesIcon from '../../assets/CoursesIcon.png';
import careersIcon from '../../assets/CareersIcon.png';

const UserDashboardSidebar = ({ activeItem = 'Dashboard' }) => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      name: 'Dashboard',
      iconSrc: dashboardIcon,
      path: '/userdashboardhome'
    },
    { 
      name: 'Assessment',
      iconSrc: assessmentIcon,
      path: '/userdashboardassessment'
    },
    { 
      name: 'Statistics',
      iconSrc: statisticsIcon,
      path: '/userdashboardhome'
    },
    { 
      name: 'Courses',
      iconSrc: coursesIcon,
      path: '/userdashboardhome'
    },
    { 
      name: 'Careers',
      iconSrc: careersIcon,
      path: '/userdashboardhome'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="user-dashboard-sidebar">
      <div className="user-dashboard-sidebar-content">
        {menuItems.map((item) => {
          return (
            <div 
              key={item.name} 
              className={`user-dashboard-menu-item ${activeItem === item.name ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={item.iconSrc} 
                alt={`${item.name} icon`}
                width={20} 
                height={20}
                style={{
                  filter: 'brightness(0) saturate(100%) invert(1)',
                  opacity: 0.7
                }}
              />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboardSidebar;