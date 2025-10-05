import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UserDashboardHeader.css';
import defaultAvatar from '../../assets/defaultAvatar.png';

const UserDashboardHeader = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    console.log('Dropdown toggled:', !isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    console.log('Navigate to Profile');
    setIsDropdownOpen(false);
    navigate('/userdashboardprofile');
  };

  const handleSettings = () => {
    console.log('Navigate to Settings');
    setIsDropdownOpen(false);
    navigate('/userdashboardsettings');
  };

  const handleLogout = () => {
    console.log('Log out');
    setIsDropdownOpen(false);
    // navigate('/login');
  };

  return (
    <div className="header-with-dropdown">
      <div className="header-logo-section">
        <div className="header-logo">
          <span className="header-graduation-cap">🎓</span>
          <span className="header-logo-text">Strandify</span>
        </div>
      </div>
      <div className="header-actions">
        <div className="header-profile-container" ref={dropdownRef}>
          <div 
            className="header-profile-avatar" 
            onClick={toggleDropdown}
          >
            <img 
              src={defaultAvatar}
              alt="Profile" 
              className="header-avatar-image"
            />
          </div>
          
          {isDropdownOpen && (
            <div className="header-dropdown-menu">
              <div className="header-dropdown-item" onClick={handleProfile}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="dropdown-icon"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Profile</span>
              </div>
              <div className="header-dropdown-item" onClick={handleSettings}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="dropdown-icon"
                >
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
                <span>Change Password</span>
              </div>
              <div className="header-dropdown-item logout" onClick={handleLogout}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="dropdown-icon"
                >
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHeader;