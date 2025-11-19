import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR' // Default to donor
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await axios.post('https://sdg-donations-backend.onrender.com/api/auth/register', formData);
      console.log('User created:', response.data);
      
      // Auto-login after successful registration
      const loginResponse = await axios.post('https://sdg-donations-backend.onrender.com/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      setUser(loginResponse.data.user);
      
      // Redirect based on user role
      if (loginResponse.data.user.role === 'ADMIN') {
        navigate('/admin/recipients');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.error || error.message));
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
            👤
          </div>
          <h1 className="display-2 mb-2">Join Our Mission</h1>
          <p className="text-lg text-secondary">
            Create your account and start making an impact today
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="card card-lg">
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`form-input ${errors.name ? 'border-error-500' : ''}`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && (
                <p className="text-error-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.name}
                </p>
              )}
            </div>

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

            {/* Account Type Selection */}
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="grid grid-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'DONOR'})}
                  className={`card card-sm text-center cursor-pointer transition-all ${
                    formData.role === 'DONOR' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">💝</div>
                  <h4 className="h4 mb-1">Donor</h4>
                  <p className="text-xs text-tertiary">
                    Make donations
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'ADMIN'})}
                  className={`card card-sm text-center cursor-pointer transition-all ${
                    formData.role === 'ADMIN' 
                      ? 'border-secondary-500 bg-secondary-50' 
                      : 'hover:border-secondary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🛠️</div>
                  <h4 className="h4 mb-1">Admin</h4>
                  <p className="text-xs text-tertiary">
                    Manage platform
                  </p>
                </button>
              </div>
              
              {/* Role Description */}
              <div className="mt-3 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                <p className="text-sm text-tertiary flex items-center gap-2">
                  <span>💡</span>
                  {formData.role === 'ADMIN' 
                    ? 'Admin accounts can manage recipients, allocations, and view detailed reports'
                    : 'Donor accounts can make donations and track their impact'
                  }
                </p>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`form-input ${errors.password ? 'border-error-500' : ''}`}
                placeholder="Create a secure password"
                required
              />
              {errors.password && (
                <p className="text-error-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-tertiary mt-2">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-tertiary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="card mt-8">
          <h3 className="h3 text-center mb-6">Why Join Our Platform?</h3>
          <div className="grid grid-2 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="h4 text-neutral-900">Secure & Transparent</h4>
              <p className="text-sm text-tertiary">Bank-level security with full donation tracking</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="h4 text-neutral-900">Track Impact</h4>
              <p className="text-sm text-tertiary">See exactly how your donations make a difference</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="h4 text-neutral-900">Global Reach</h4>
              <p className="text-sm text-tertiary">Support SDG initiatives worldwide</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-3xl mb-3">💝</div>
              <h4 className="h4 text-neutral-900">Make a Difference</h4>
              <p className="text-sm text-tertiary">Join thousands creating positive change</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;