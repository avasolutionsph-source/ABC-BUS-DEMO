import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/login', formData);
      const { token, userId, message } = response.data;
      
      onLogin({ userId, username: formData.email.split('@')[0] }, token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h2>Welcome Back!</h2>
        <p>Login to book your next journey with ABC Bus</p>
        <div style={{ margin: '2rem 0' }}>
          <h3>🚌 Features:</h3>
          <ul>
            <li>✅ Easy seat selection</li>
            <li>💳 Secure payment in PHP</li>
            <li>📱 QR code tickets</li>
            <li>📍 Real-time bus tracking</li>
            <li>📅 Flexible scheduling</li>
          </ul>
        </div>
      </div>
      
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;