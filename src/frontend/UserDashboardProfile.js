import React, { useState, useEffect } from "react";
import axios from "axios";
import UserDashboardSidebar from "./component/UserDashboardSidebar";
import UserDashboardHeader from "./component/UserDashboardHeader";
import "./UserDashboardProfile.css";
import defaultAvatar from "../assets/defaultAvatar.png";

const formatFieldName = (key) => {
  const map = {
    first_name: "First Name",
    middle_name: "Middle Name",
    last_name: "Last Name",
    affix: "Affix",
    email: "Email Address",
    birthday: "Birthday",
  };
  return map[key] || key;
};

const ConfirmModal = ({ changes, onConfirm, onCancel }) => {
  if (!changes || changes.length === 0) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-box">
        <h2 className="confirm-modal-title">Confirm Changes</h2>
        <div className="confirm-changes-list">
          {changes.map(({ field, oldValue, newValue }) => (
            <div key={field} className="confirm-change-item">
              <span className="confirm-change-label">{formatFieldName(field)}:</span>
              <span className="confirm-change-old">{oldValue || "—"}</span> → 
              <span className="confirm-change-new">{newValue || "—"}</span>
            </div>
          ))}
        </div>
        <div className="confirm-modal-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDashboardProfile = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [confirmChanges, setConfirmChanges] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    affix: "",
    email: "",
    birthday: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/me`, {
          withCredentials: true,
        });

        const userData = response.data;
        setFormData({
          first_name: userData.first_name || "",
          middle_name: userData.middle_name || "",
          last_name: userData.last_name || "",
          affix: userData.affix || "",
          email: userData.email || "",
          birthday: userData.birthday || "",
        });
        setOriginalData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setModalMessage("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // detect changes
  const detectChanges = () => {
    return Object.keys(formData)
      .filter((key) => formData[key] !== originalData[key])
      .map((key) => ({
        field: key,
        oldValue: originalData[key],
        newValue: formData[key],
      }));
  };

  const handleSave = () => {
    const changes = detectChanges();
    if (changes.length === 0) {
      setModalMessage("No changes to save.");
      return;
    }
    setConfirmChanges(changes); // show confirm modal
  };

  const confirmSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/profile/update`, formData, {
        withCredentials: true,
      });
      setModalMessage("✅ Profile updated successfully!");
      setOriginalData({ ...formData });
    } catch (error) {
      console.error("Error saving profile:", error);
      setModalMessage("❌ Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
      setConfirmChanges(null);
    }
  };

  const handleRevert = () => {
    setFormData({ ...originalData });
    setModalMessage("Changes reverted.");
  };

  const hasChanges = detectChanges().length > 0;

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
                  src={defaultAvatar}
                  alt="Profile Avatar"
                  className="profile-avatar-image"
                />
              </div>
              <div className="profile-welcome">
                <h1 className="profile-welcome-title">
                  Welcome,{" "}
                  <span className="profile-name-highlight">
                    {formData.first_name || "User"}
                  </span>
                  !
                </h1>
              </div>
            </div>

            {/* Profile Form */}
            <div className="profile-form">
              {["first_name", "middle_name", "last_name", "affix", "email", "birthday"].map((field) => (
                <div className="profile-form-group" key={field}>
                  <label className="profile-label">{formatFieldName(field)}:</label>
                  <input
                    type={field === "birthday" ? "date" : field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="profile-input"
                    readOnly={field === "email"}
                  />
                </div>
              ))}

              <div className="profile-save-section">
                <button
                  className="profile-save-btn"
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="profile-revert-btn"
                  onClick={handleRevert}
                  disabled={!hasChanges || saving}
                >
                  Revert Changes
                </button>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <p className="profile-copyright">
              © 2025 PathFinder. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        changes={confirmChanges}
        onConfirm={confirmSave}
        onCancel={() => setConfirmChanges(null)}
      />

      {/* Feedback Modal */}
      {modalMessage && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{modalMessage}</p>
            <button
              onClick={() => setModalMessage(null)}
              className="modal-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardProfile;
