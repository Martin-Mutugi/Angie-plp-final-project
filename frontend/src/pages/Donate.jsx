import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Donate = ({ user }) => {
  const [formData, setFormData] = useState({
    type: 'POOL',
    recipientId: '',
    amount: '',
    currency: 'KES',
    donorEmail: user?.email || '',
    donorName: user?.name || ''
  });
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRecipients, setIsFetchingRecipients] = useState(false);

  // Fetch recipients when component loads
  useEffect(() => {
    const fetchRecipients = async () => {
      setIsFetchingRecipients(true);
      try {
        const response = await axios.get('http://localhost:5000/api/recipients');
        setRecipients(response.data);
      } catch (error) {
        console.error('Error fetching recipients:', error);
        alert('Failed to load recipients. Please try again.');
      } finally {
        setIsFetchingRecipients(false);
      }
    };
    fetchRecipients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/donations/init', formData);
      console.log('Full response:', response.data);
      
      // Check for both possible authorization URL keys
      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else if (response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else {
        alert('Donation initialized! Donation ID: ' + response.data.donationId);
      }
    } catch (error) {
      alert('Donation failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container section-sm">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="display-2 mb-4">Make an Impact</h1>
          <p className="text-lg text-secondary">
            Support Sustainable Development Goals through transparent, direct donations
          </p>
        </div>

        {/* Donation Form Card */}
        <div className="card card-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient rounded-2xl flex items-center justify-center text-white text-xl">
              💝
            </div>
            <div>
              <h2 className="h3">Donation Details</h2>
              <p className="text-sm text-tertiary">Every contribution makes a difference</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Donation Type */}
            <div className="form-group">
              <label className="form-label">Donation Type</label>
              <div className="grid grid-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'POOL', recipientId: ''})}
                  className={`card card-sm text-center cursor-pointer transition-all ${
                    formData.type === 'POOL' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="h4 mb-1">General Pool</h4>
                  <p className="text-xs text-tertiary">
                    Support all SDG initiatives
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'DIRECT'})}
                  className={`card card-sm text-center cursor-pointer transition-all ${
                    formData.type === 'DIRECT' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="h4 mb-1">Direct Donation</h4>
                  <p className="text-xs text-tertiary">
                    Support specific recipients
                  </p>
                </button>
              </div>
            </div>

            {/* Recipient Selection */}
            {formData.type === 'DIRECT' && (
              <div className="form-group">
                <label className="form-label">Select Recipient</label>
                {isFetchingRecipients ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="loading"></div>
                    <span className="ml-2 text-tertiary">Loading recipients...</span>
                  </div>
                ) : (
                  <select 
                    value={formData.recipientId}
                    onChange={(e) => setFormData({...formData, recipientId: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Choose a recipient...</option>
                    {recipients.map(recipient => (
                      <option key={recipient._id} value={recipient._id}>
                        {recipient.fullName} - {recipient.bio.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">Donation Amount (KES)</label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="form-input pl-12"
                  placeholder="500"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary">
                  KES
                </div>
              </div>
              <p className="text-xs text-tertiary mt-2">Minimum donation: 100 KES</p>
            </div>

            {/* Donor Information */}
            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input
                  type="email"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData({...formData, donorEmail: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  value={formData.donorName}
                  onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Impact Preview */}
            <div className="card bg-primary-50 border-primary-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-primary-600 text-xl">✨</div>
                <div>
                  <h4 className="h4 text-primary-700">Your Impact</h4>
                  <p className="text-sm text-primary-600">
                    {formData.amount ? `Your donation of ${formData.amount} KES will support ` : 'Your donation will support '}
                    {formData.type === 'POOL' ? 'multiple SDG initiatives' : 'a specific community project'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-neutral-100 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 text-sm text-tertiary">
              <span>🔒</span>
              <span>Your payment is secured with bank-level encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;