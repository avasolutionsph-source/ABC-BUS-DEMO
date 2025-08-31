import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      
      const { token, userId, message } = response.data;
      onRegister({ userId, username: formData.username }, token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h2>Join ABC Bus!</h2>
        <p>Create your account and start traveling across the Philippines with comfort and reliability.</p>
        
        <div style={{ margin: '2rem 0' }}>
          <h3>🇵🇭 Popular Routes:</h3>
          <ul>
            <li>Manila ↔ Baguio - ₱500</li>
            <li>Manila ↔ Cebu - ₱1,200</li>
            <li>Manila ↔ Davao - ₱2,500</li>
            <li>Quezon City ↔ Tagaytay - ₱150</li>
          </ul>
        </div>

        <div className="alert alert-success">
          <strong>Safe & Secure:</strong> All payments processed securely with Philippine payment methods
        </div>
      </div>
      
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Juan Dela Cruz"
            />
          </div>

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
              placeholder="juan@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="09XX XXX XXXX"
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
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;