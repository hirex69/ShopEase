import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook from React Router
import './CSS/LoginModal.css'; // Add your own styles here

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();  // Initialize the navigate function

  // Function to handle redirection to login page
  const handleLoginClick = () => {
    navigate('/login');  // Navigate to the login page
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2>Please Log In</h2>
        <p>You must be logged in to add products to your cart.</p>
        <button onClick={handleLoginClick}>Login</button> {/* Redirect to login page */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
