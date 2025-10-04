import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboardSidebar from './component/UserDashboardSidebar';
import UserDashboardHeader from './component/UserDashboardHeader';
import './UserDashboardProfile.css';

// Avatar URLs 
const AVATARS = {
  male: 'https://api.dicebear.com/7.x/avataaars/svg?seed=male&backgroundColor=b6e3f4',
  female: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female&backgroundColor=ffdfbf&hair=long'
};

const UserDashboardProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    birthday: '',
    gender: ''
  });
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/me', {
          withCredentials: true
        });
        
        const userData = response.data;
        setFormData({
          fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          username: userData.username || '',
          email: userData.email || '',
          birthday: userData.birthday || '',
          gender: userData.gender || ''
        });
        setAvatar(userData.avatar_url || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarEdit = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarSelect = async (avatarType) => {
    const newAvatar = AVATARS[avatarType];
    setAvatar(newAvatar);
    setShowAvatarModal(false);
    
    // Update avatar on backend
    try {
      await axios.put('http://localhost:5000/profile', 
        { avatar_url: newAvatar }, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/profile', 
        { ...formData, avatar_url: avatar }, 
        { withCredentials: true }
      );
      alert('Profile updated successfully!');
      // Refresh the page to update header avatar
      window.location.reload();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <UserDashboardHeader />
        <div className="profile-main-layout">
          <UserDashboardSidebar activeItem="Profile" />
          <div className="profile-main-content">
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <UserDashboardHeader />
      <div className="profile-main-layout">
        <UserDashboardSidebar activeItem="Profile" />
        <div className="profile-main-content">
          <div className="profile-content-section">
            <div className="profile-header-section">
              <div className="profile-avatar-container">
                <img 
                  src={avatar || 'https://via.placeholder.com/150'} 
                  alt="Profile Avatar"
                  className="profile-avatar-image"
                />
              </div>
              <div className="profile-welcome">
                <h1 className="profile-welcome-title">
                  Welcome, <span className="profile-name-highlight">{formData.fullName.split(' ')[0] || 'User'}</span>!
                </h1>
                <button className="profile-edit-avatar-btn" onClick={handleAvatarEdit}>
                  Edit Avatar
                </button>
              </div>
            </div>

            <div className="profile-form">
              <div className="profile-form-group">
                <label className="profile-label">Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Email Address:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Birthday:</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="profile-select"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="profile-save-section">
                <button 
                  className="profile-save-btn" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <p className="profile-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-modal-header">
              <h2>Choose Your Avatar</h2>
              <button 
                className="avatar-modal-close"
                onClick={() => setShowAvatarModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="avatar-options">
              <div 
                className={`avatar-option ${avatar === AVATARS.male ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect('male')}
              >
                <img src={AVATARS.male} alt="Male Avatar" />
                <span>Male</span>
              </div>
              <div 
                className={`avatar-option ${avatar === AVATARS.female ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect('female')}
              >
                <img src={AVATARS.female} alt="Female Avatar" />
                <span>Female</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardProfile;