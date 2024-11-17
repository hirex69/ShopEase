import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after successful registration
import { useAuth } from '../../context/Authcontext.jsx';
import './customercss/Login.css'
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Local state to hold form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  
  // Local state for handling errors and loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    setError('');  // Reset error
    setLoading(true);  // Start loading

    try {
      // Call the register function from context
      await register(username, email, password, role);
      setLoading(false);
      
      // Redirect to login or home page on success
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      setLoading(false);
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="login-link">
        <p>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'blue' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
