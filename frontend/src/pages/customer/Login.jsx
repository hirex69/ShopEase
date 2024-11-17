// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './customercss/Login.css'
import { useAuth } from '../../context/Authcontext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      // Call the login function from context to authenticate the user
      await login(email, password);

      // Redirect based on the user's role
      if (localStorage.getItem('role') === 'admin') {
        navigate('/admindashboard'); // Admin dashboard page
      } else {
        navigate('/'); // Regular user home page
      }
    } catch (err) {
      setError('Invalid credentials, please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="signup-link">
        <p>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'blue' }}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
