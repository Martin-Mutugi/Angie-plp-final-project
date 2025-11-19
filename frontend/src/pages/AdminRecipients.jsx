import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRecipients = ({ user }) => {
  const [recipients, setRecipients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    needs: [{ category: 'FOOD', description: '', amountNeeded: '' }],
    location: { city: '', country: 'Kenya' }
  });

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get('http://localhost:5000/api/recipients');
      setRecipients(response.data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      alert('Failed to load recipients. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/recipients', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Recipient added successfully!');
      setShowForm(false);
      setFormData({
        fullName: '',
        bio: '',
        needs: [{ category: 'FOOD', description: '', amountNeeded: '' }],
        location: { city: '', country: 'Kenya' }
      });
      fetchRecipients();
    } catch (error) {
      alert('Error adding recipient: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const addNeed = () => {
    setFormData({
      ...formData,
      needs: [...formData.needs, { category: 'FOOD', description: '', amountNeeded: '' }]
    });
  };

  const removeNeed = (index) => {
    const newNeeds = formData.needs.filter((_, i) => i !== index);
    setFormData({ ...formData, needs: newNeeds });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'text-success-600 bg-success-50 border-success-200';
      case 'PENDING': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'REJECTED': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      FOOD: '🍎',
      EDUCATION: '📚',
      HEALTHCARE: '🏥',
      HOUSING: '🏠',
      CLOTHING: '👕',
      OTHER: '📦'
    };
    return icons[category] || '📦';
  };

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container section">
        <div className="max-w-md mx-auto text-center">
          <div className="card card-lg">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="display-2 mb-4">Admin Access Required</h1>
            <p className="text-lg text-secondary mb-6">
              This area is restricted to platform administrators only.
            </p>
            <div className="space-y-4">
              <a href="/login" className="btn btn-primary w-full">
                Sign In as Admin
              </a>
              <a href="/" className="btn btn-outline w-full">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="display-2 mb-2">Manage Recipients</h1>
          <p className="text-lg text-secondary">
            Add and manage individuals and communities in need
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            Admin Mode
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className="btn btn-outline btn-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Recipient Card */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="h2">Recipient Management</h2>
            <p className="text-tertiary">Add new recipients to the platform</p>
          </div>
          <button 
            className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <span className="flex items-center gap-2">
                <span>✕</span>
                Cancel
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>➕</span>
                Add New Recipient
              </span>
            )}
          </button>
        </div>

        {/* Recipient Creation Form */}
        {showForm && (
          <div className="border-t pt-6">
            <h3 className="h3 mb-6 flex items-center gap-2">
              <span>👤</span>
              Add Needy Person
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location City</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData({
                      ...formData, 
                      location: {...formData.location, city: e.target.value}
                    })}
                    className="form-input"
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Bio / Story</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="form-input"
                  rows="4"
                  placeholder="Tell their story and situation..."
                  required
                />
              </div>

              {/* Needs Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="form-label">Needs & Requirements</label>
                  <button 
                    type="button" 
                    onClick={addNeed}
                    className="btn btn-ghost btn-sm flex items-center gap-2"
                  >
                    <span>➕</span>
                    Add Need
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.needs.map((need, index) => (
                    <div key={index} className="card card-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-neutral-700">Need #{index + 1}</h4>
                        {formData.needs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNeed(index)}
                            className="text-error-500 hover:text-error-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-3 gap-4">
                        <div>
                          <label className="form-label text-sm">Category</label>
                          <select
                            value={need.category}
                            onChange={(e) => {
                              const newNeeds = [...formData.needs];
                              newNeeds[index].category = e.target.value;
                              setFormData({...formData, needs: newNeeds});
                            }}
                            className="form-input text-sm"
                          >
                            <option value="FOOD">Food & Nutrition</option>
                            <option value="EDUCATION">Education</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="HOUSING">Housing</option>
                            <option value="CLOTHING">Clothing</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label text-sm">Description</label>
                          <input
                            type="text"
                            placeholder="Specific need description"
                            value={need.description}
                            onChange={(e) => {
                              const newNeeds = [...formData.needs];
                              newNeeds[index].description = e.target.value;
                              setFormData({...formData, needs: newNeeds});
                            }}
                            className="form-input text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label text-sm">Amount Needed (KES)</label>
                          <input
                            type="number"
                            placeholder="5000"
                            value={need.amountNeeded}
                            onChange={(e) => {
                              const newNeeds = [...formData.needs];
                              newNeeds[index].amountNeeded = e.target.value;
                              setFormData({...formData, needs: newNeeds});
                            }}
                            className="form-input text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Adding Recipient...' : 'Add Recipient to System'}
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Recipients List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="h2">Recipient Profiles</h2>
            <p className="text-tertiary">
              {recipients.length} recipient{recipients.length !== 1 ? 's' : ''} in the system
            </p>
          </div>
          <button 
            onClick={fetchRecipients}
            className="btn btn-ghost btn-sm flex items-center gap-2"
            disabled={isFetching}
          >
            <span>🔄</span>
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading"></div>
            <span className="ml-3 text-tertiary">Loading recipients...</span>
          </div>
        ) : recipients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="h3 text-neutral-700 mb-2">No Recipients Yet</h3>
            <p className="text-tertiary mb-6">
              Start by adding the first recipient to the platform
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add First Recipient
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {recipients.map(recipient => (
              <div key={recipient._id} className="card card-hover">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg">
                        👤
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="h3 text-neutral-900">{recipient.fullName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(recipient.verificationStatus)}`}>
                            {recipient.verificationStatus}
                          </span>
                        </div>
                        <p className="text-tertiary mb-3">{recipient.bio}</p>
                        <p className="text-sm text-tertiary flex items-center gap-2">
                          <span>📍</span>
                          {recipient.location?.city}, {recipient.location?.country}
                        </p>
                      </div>
                    </div>

                    {/* Needs List */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                        <span>🎯</span>
                        Needs ({recipient.needs?.length || 0})
                      </h4>
                      <div className="grid grid-2 gap-3">
                        {recipient.needs?.map((need, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                            <span className="text-xl">{getCategoryIcon(need.category)}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-neutral-900">{need.description}</p>
                              <p className="text-xs text-tertiary">{need.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-600">{need.amountNeeded?.toLocaleString()} KES</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:text-right">
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                      <p className="text-2xl font-bold text-primary-600 mb-1">
                        {recipient.totalReceived?.toLocaleString()} KES
                      </p>
                      <p className="text-sm text-primary-700">Total Received</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecipients;