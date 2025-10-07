
import React from "react";
import "./css/ErrorModal.css";

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Error</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
