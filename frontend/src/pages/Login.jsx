import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('https://sdg-donations-backend.onrender.com/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (setUser) {
        setUser(response.data.user);
      }
      
      // Redirect based on user role
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin/recipients');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container section-sm">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
            🔐
          </div>
          <h1 className="display-2 mb-2">Welcome Back</h1>
          <p className="text-lg text-secondary">
            Sign in to your account to continue making an impact
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card card-lg">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`form-input ${errors.email ? 'border-error-500' : ''}`}
                placeholder="your.email@example.com"
                required
              />
              {errors.email && (
                <p className="text-error-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`form-input ${errors.password ? 'border-error-500' : ''}`}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="text-error-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password & Register Links */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-tertiary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Create account here
                </Link>
              </p>
              <p className="text-sm text-tertiary">
                <button className="text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot your password?
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Accounts Info */}
        <div className="card mt-8">
          <h3 className="h3 text-center mb-4">Demo Access</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
              <span className="font-medium">Admin Account</span>
              <span className="text-tertiary">Full platform access</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
              <span className="font-medium">Donor Account</span>
              <span className="text-tertiary">Make donations & track impact</span>
            </div>
          </div>
          <p className="text-xs text-tertiary text-center mt-4">
            Register a new account to test different user roles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;