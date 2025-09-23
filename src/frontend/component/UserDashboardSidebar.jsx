import React from 'react';
import './css/UserDashboardSidebar.css';

const UserDashboardSidebar = ({ activeItem = 'Dashboard' }) => {
  const menuItems = [
    { name: 'Dashboard'},
    { name: 'Assessment'},
    { name: 'Statistics'},
    { name: 'Courses'},
    { name: 'Careers'}
  ];

  return (
    <div className="user-dashboard-sidebar">
      <div className="user-dashboard-sidebar-content">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.name} 
              className={`user-dashboard-menu-item ${activeItem === item.name ? 'active' : ''}`}
            >
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboardSidebar;